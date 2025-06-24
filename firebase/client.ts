import { Analytics, getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { isSupported as isMessagingSupported } from "firebase/messaging";
import { getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "@firebase/messaging";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRVwj6S4NIX0y8U1Lp2x6a7VaD57WasPg",
  authDomain: "grupo-diaz-alvarez-hermanos.firebaseapp.com",
  projectId: "grupo-diaz-alvarez-hermanos",
  storageBucket: "grupo-diaz-alvarez-hermanos.firebasestorage.app",
  messagingSenderId: "84098978214",
  appId: "1:84098978214:web:ef2066d6b26489d36dff67",
  measurementId: "G-DZ87MYGWZR"
};

const currentApps = getApps()
let auth: Auth
let storage: FirebaseStorage
let db: Firestore

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  storage = getStorage(app)
  db = getFirestore(app)
} else {
  const app = currentApps[0]
  auth = getAuth(app)
  storage = getStorage(app)
  db = getFirestore(app)
}

export { auth, db, storage };

{/**
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
}; */}