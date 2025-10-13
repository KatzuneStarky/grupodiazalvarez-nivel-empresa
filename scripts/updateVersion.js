const path = require("path")
const admin = require("firebase-admin")
const fs = require("fs")
const dotenv = require("dotenv")

const envPath = path.resolve(__dirname, "../.env.local")
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
}

if (!process.env.SERVICE_ACCOUNT_KEY_BASE64) {
    console.error("❌ ERROR: La variable SERVICE_ACCOUNT_KEY_BASE64 no está definida.")
    process.exit(1)
}

let serviceAccount
try {
    serviceAccount = JSON.parse(
        Buffer.from(process.env.SERVICE_ACCOUNT_KEY_BASE64, "base64").toString("utf-8")
    )
} catch (err) {
    console.error("❌ ERROR: No se pudo decodificar SERVICE_ACCOUNT_KEY_BASE64:", err)
    process.exit(1)
}

// Inicializa Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function updateVersion() {
    try {
        const version = Date.now() // timestamp único
        await db.doc("configuracion/version").set({ version })
        console.log("✅ Versión actualizada correctamente:", version)
    } catch (err) {
        console.error("❌ Error al actualizar versión:", err)
        process.exit(1)
    }
}

updateVersion()