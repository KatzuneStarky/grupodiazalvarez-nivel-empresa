export const getUnidadesMedidaSat = async () => {
    try {
        const response = await fetch("https://docs.fiscalapi.com/api/catalogs/SatUnitMeasurements", {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_FISCAL_API_KEY}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener catálogo: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.log(error);
        //throw new Error(error as string);
    }
}