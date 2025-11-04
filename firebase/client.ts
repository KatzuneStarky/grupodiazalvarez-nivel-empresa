import { FirebaseStorage, getStorage } from "firebase/storage";
import { Firestore, getFirestore } from "firebase/firestore";
import { getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKy-xbk7hWXaJ66m0AM51g71lP-oX4hBc",
  authDomain: "grupo-diaz-alvarez-herma-f35ff.firebaseapp.com",
  projectId: "grupo-diaz-alvarez-herma-f35ff",
  storageBucket: "grupo-diaz-alvarez-herma-f35ff.firebasestorage.app",
  messagingSenderId: "101278628443",
  appId: "1:101278628443:web:5a6ec0a732530e2b2ddd7e",
  measurementId: "G-VPD67WWK73"
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