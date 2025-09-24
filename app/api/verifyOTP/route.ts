import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { db } from "@/firebase/client";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { to, otp, userId } = await req.json();

        if (!to || !otp || !userId) {
            return NextResponse.json(
                { message: "Teléfono, User ID y OTP son requeridos" },
                { status: 400 }
            );
        }

        const otpRef = doc(db, "otps", to);
        const snapshot = await getDoc(otpRef);

        if (!snapshot.exists()) {
            return NextResponse.json(
                { message: "OTP no encontrado o inválido" },
                { status: 400 }
            );
        }

        const data = snapshot.data();

        if (data.used) {
            return NextResponse.json({ message: "OTP ya usado" }, { status: 400 });
        }

        if (Date.now() > data.expiresAt) {
            return NextResponse.json({ message: "OTP expirado" }, { status: 400 });
        }

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        if (otpHash !== data.otp) {
            return NextResponse.json({ message: "OTP incorrecto" }, { status: 400 });
        }

        await updateDoc(otpRef, { used: true });

        return NextResponse.json({ message: "OTP verificado" }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Error al verificar OTP", error: error.message },
            { status: 500 }
        );
    }
}