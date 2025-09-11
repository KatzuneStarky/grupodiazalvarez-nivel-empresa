import { NextResponse } from "next/server";
import Facturapi from "facturapi";

const facturapi = new Facturapi(process.env.NEXT_FACTURAPI_API_KEY!);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") || "";

        if (!q) {
            return NextResponse.json(
                { error: "Debes enviar un parámetro 'q'" },
                { status: 400 }
            );
        }

        const unidades = await facturapi.catalogs.searchUnits({ q });

        return NextResponse.json(unidades.data);
    } catch (error: any) {
        console.error("Error obteniendo unidades SAT:", error);
        return NextResponse.json(
            { error: error.message || "Error al obtener unidades" },
            { status: 500 }
        );
    }
}