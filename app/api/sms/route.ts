import { collection, doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server"
import { db } from "@/firebase/client";
import crypto from "crypto";
import twilio from "twilio"

const accoundSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromPhone = process.env.TWILIO_PHONE_NUMBER
const client = twilio(accoundSID, authToken)

const generateSecureOTP = (): string => {
    const buffer = crypto.randomBytes(4);
    const number = buffer.readUInt32BE(0) % 1000000;
    return number.toString().padStart(6, "0");
}

export async function POST(req: Request) {
    try {
        const { to, userId } = await req.json();

        if (!to) {
            return NextResponse.json(
                { message: "El número de destino es requerido" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { message: "El id del usuario es requerido" },
                { status: 400 }
            );
        }

        const otp = generateSecureOTP();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        const message = await client.messages.create({
            body: `Tu codigo de desbloqueo es ${otp}`,
            from: fromPhone,
            to,
            validityPeriod: 60 * 60
        })

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        await setDoc(doc(collection(db, "otps"), to), {
            otp: otpHash,
            phone: to,
            expiresAt,
            used: false,
            userId
        });

        console.log("Mensaje SID:", message.sid);

        if (!message.sid) {
            return NextResponse.json(
                { message: "Error al enviar el mensaje de texto" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Mensaje enviado correctamente", otp },
            { status: 200 }
        );
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { message: "Error al enviar el mensaje de texto", error: error.message },
            { status: 500 }
        );
    }
}