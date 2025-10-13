import { NextResponse } from "next/server";
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
    try {
        const { to, subject } = await req.json()

        if (!to || !subject) {
            return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Grupo Diaz Alvarez <no-reply@grupodiazalvarez.com>',
            to,
            subject,
            text: "test"
        })

        if (error) {
            return NextResponse.json({ message: "Error al enviar el correo", error }, { status: 500 });
        }

        return NextResponse.json({ message: "Correo enviado satisfactoriamente", data }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Error al enviar el correo", error: error.message },
            { status: 500 }
        );
    }
}