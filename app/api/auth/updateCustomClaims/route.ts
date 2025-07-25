import { NextRequest, NextResponse } from "next/server";
import { adminApp } from "@/firebase/server";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";

const schema = z.object({
    uid: z.string(),
    rol: z.string(),
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { uid, rol } = schema.parse(body);

    if (!uid || !rol) {
        return NextResponse.json({ error: "UID y rol requeridos." }, { status: 400 });
    }

    try {
        const auth = getAuth(adminApp);
        await auth.setCustomUserClaims(uid, { rol });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error setting custom claims:", error);
        return NextResponse.json({ error: "No se pudo establecer el rol." }, { status: 500 });
    }
}