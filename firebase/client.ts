import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { isSupported as isMessagingSupported } from "firebase/messaging";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "@firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyChsV-iiYNOijzfLAM7utVfc1V0dZlLF5g",
    authDomain: "grupodiazalvarez-v2.firebaseapp.com",
    projectId: "grupodiazalvarez-v2",
    storageBucket: "grupodiazalvarez-v2.firebasestorage.app",
    messagingSenderId: "522374486005",
    appId: "1:522374486005:web:4714491a6d6366c058b2bc",
    measurementId: "G-SN09XNR6T8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const analytics = isAnalyticsSupported().then((yes) => yes ? getAnalytics(app) : null);

export const initializeMessaging = async (): Promise<ReturnType<typeof getMessaging> | undefined> => {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const isSupported = await isMessagingSupported();
    return isSupported ? getMessaging(app) : undefined;
  } catch (error) {
    console.error('Error initializing messaging:', error);
    return undefined;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const messagingInstance = await initializeMessaging();
    if (!messagingInstance) return null;
    
    return await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    });
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};