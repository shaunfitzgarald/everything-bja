import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, increment, doc, setDoc } from 'firebase/firestore';

export const useAnalytics = () => {
  const trackClick = async (itemId, category = 'general', label = '') => {
    const consent = localStorage.getItem('bja_privacy_consent');
    
    try {
      // 1. Log individual event only if accepted (GDPR/CCPA Compliance)
      if (consent === 'accepted') {
        await addDoc(collection(db, 'analytics_events'), {
          itemId,
          category,
          label,
          timestamp: serverTimestamp(),
          type: 'click'
        });
      }

      // 2. Update aggregate count for the dashboard (Always, as it lacks PII)
      const statsRef = doc(db, 'analytics_stats', itemId);
      await setDoc(statsRef, {
        itemId,
        category,
        label,
        clickCount: increment(1),
        lastClicked: serverTimestamp()
      }, { merge: true });
      
    } catch (e) {
      console.error("Error tracking click:", e);
    }
  };

  return { trackClick };
};
