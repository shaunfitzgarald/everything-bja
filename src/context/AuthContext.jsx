import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          // Check if user is in admin allowlist
          const adminRef = doc(db, 'admin', 'allowlist');
          const adminSnap = await getDoc(adminRef);
          if (adminSnap.exists()) {
            const userEmail = currentUser.email.toLowerCase().trim();
            const rawEmails = adminSnap.data().emails || [];
            const isAdminOnList = rawEmails.some(email => {
              if (typeof email !== 'string') return false;
              const cleanEmail = email.toLowerCase().trim().replace(/^['"]|['"]$/g, '');
              const match = cleanEmail === userEmail;
              
              if (!match && (cleanEmail.includes(userEmail) || userEmail.includes(cleanEmail))) {
                 console.log(`[AUTH VERBOSE] Close match found: DB="${cleanEmail}" (${cleanEmail.length}), USER="${userEmail}" (${userEmail.length})`);
                 console.log(`[AUTH VERBOSE] DB char codes: ${[...cleanEmail].map(c => c.charCodeAt(0))}`);
                 console.log(`[AUTH VERBOSE] USER char codes: ${[...userEmail].map(c => c.charCodeAt(0))}`);
              }
              return match;
            });
            
            console.log(`[AUTH DEBUG] User: ${userEmail}, Full Doc Data:`, adminSnap.data(), `List:`, rawEmails, `Result: ${isAdminOnList}`);
            setIsAdmin(isAdminOnList);
          } else {
            console.error("[AUTH DEBUG] admin/allowlist doc missing in Firestore!");
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("[AUTH DEBUG] Critical error:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const checkAdmin = async () => {
    if (!auth.currentUser) return;
    try {
      const adminRef = doc(db, 'admin', 'allowlist');
      const adminSnap = await getDoc(adminRef);
      if (adminSnap.exists()) {
        const rawEmails = adminSnap.data().emails || [];
        const userEmail = auth.currentUser.email.toLowerCase().trim();
        const isAdminOnList = rawEmails.some(email => {
          if (typeof email !== 'string') return false;
          const cleanEmail = email.toLowerCase().trim().replace(/^['"]|['"]$/g, '');
          return cleanEmail === userEmail;
        });
        console.log(`[MANUAL CHECK] User: ${userEmail}, Raw List:`, rawEmails, `Result: ${isAdminOnList}`);
        setIsAdmin(isAdminOnList);
        return isAdminOnList;
      }
    } catch (e) {
      console.error("[MANUAL CHECK] Error:", e);
    }
  };

  const login = () => signInWithPopup(auth, googleProvider);
  const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const value = {
    user,
    isAdmin,
    loading,
    login,
    loginWithEmail,
    logout,
    checkAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
