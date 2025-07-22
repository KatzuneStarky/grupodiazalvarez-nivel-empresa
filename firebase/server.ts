import { Firestore, getFirestore } from "firebase-admin/firestore"
import { cert, getApps, ServiceAccount } from "firebase-admin/app"
import { Auth, getAuth } from "firebase-admin/auth"
import admin, { initializeApp } from "firebase-admin"

const serviceAccount = {
    "type": "service_account",
    "project_id": "grupo-diaz-alvarez-hermanos",
    "private_key_id": process.env.FIREBASE_PRIVATE_KET_ID?.replace(/\\n/g, "\n"),
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40grupo-diaz-alvarez-hermanos.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

let firestore: Firestore
let auth: Auth
const currentApps = getApps()

if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error("Missing Firebase private key.");
}

if (!currentApps.length) {
    const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount)
    })

    firestore = getFirestore(app)
    auth = getAuth(app)
} else {
    const app = currentApps[0]
    firestore = getFirestore(app)
    auth = getAuth(app)
}

export const adminApp = getApps().length === 0
    ? initializeApp({ credential: cert(serviceAccount as ServiceAccount) })
    : getApps()[0];

export { firestore, auth }