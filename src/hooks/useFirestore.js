import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';

// Singleton for site config
export const useSiteConfig = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubsribe = onSnapshot(doc(db, 'config', 'site'), (doc) => {
      if (doc.exists()) {
        setData(doc.data());
      } else {
        // Fallback defaults
        setData({
          displayName: "Brian Jordan Alvarez",
          tagline: "Hello, it is me BJA. Welcome to my web-palace.",
          bio: "Just a guy doing his best to keep the energy high and the camp level higher.",
          shopMode: "link",
          shopUrl: "https://bjastore.com",
          featuredVideo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        });
      }
      setLoading(false);
    });

    return unsubsribe;
  }, []);

  return { data, loading };
};

// Generic collection hook
export const useFirestoreCollection = (collectionName, filters = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = collection(db, collectionName);
    
    // Simple priority ordering if applicable
    q = query(q, orderBy('priority', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching collection ${collectionName}:`, error);
      setLoading(false);
    });

    return unsubscribe;
  }, [collectionName]);

  return { data, loading };
};
