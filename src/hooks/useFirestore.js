import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, getDocs } from 'firebase/firestore';

// Singleton for site config
export const useSiteConfig = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'site'), (doc) => {
      if (doc.exists()) {
        setData(doc.data());
      } else {
        // Fallback defaults if doc doesn't exist
        setData({
          displayName: "Brian Jordan Alvarez",
          tagline: "Hello, it is me BJA. Welcome to my web-palace.",
          heroImage: "/assets/hero_bja.png",
          bio: "Creator of The Gay and Wondrous Life of Caleb Gallo, English Teacher, and more.",
          shopMode: "link",
          shopUrl: "https://bjastore.com",
          cameoUrl: "https://www.cameo.com/brianjordanalvarez",
          letterboxdUrl: "https://letterboxd.com/actor/brian-jordan-alvarez/",
          featuredVideo: "https://www.youtube.com/embed/RtHC29merkU?si" // FX's English Teacher Trailer
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching site config:", error);
      // Even on error, stop loading so we can show UI/fallbacks
      setLoading(false);
      setData({
        displayName: "Brian Jordan Alvarez",
        tagline: "Hello, it is me BJA. Welcome to my web-palace.",
        bio: "Just a guy doing his best to keep the energy high and the camp level higher.",
        shopMode: "link",
        shopUrl: "https://bjastore.com",
        cameoUrl: "https://www.cameo.com/brianjordanalvarez",
        letterboxdUrl: "https://letterboxd.com/actor/brian-jordan-alvarez/",
        featuredVideo: "https://www.youtube.com/embed/RtHC29merkU?si" // FX's English Teacher Trailer
      });
    });

    return unsubscribe;
  }, []);

  return { data, loading };
};

// Generic collection hook
export const useFirestoreCollection = (collectionName, orderField = 'priority') => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = collection(db, collectionName);
    
    if (orderField) {
      try {
        q = query(q, orderBy(orderField, 'desc'));
      } catch (e) {
        console.warn(`Could not order by ${orderField}, falling back to default.`, e);
      }
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(docs);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching collection ${collectionName}:`, error);
      // If index is missing or field doesn't exist, try again without ordering
      if (orderField && (error.code === 'failed-precondition' || error.message.includes('index'))) {
         console.info(`Attempting fallback fetch for ${collectionName} without ordering...`);
         const fallbackQ = collection(db, collectionName);
         getDocs(fallbackQ).then(snap => {
           const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setData(docs);
         }).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [collectionName, orderField]);

  return { data, loading };
};
