export const getIpAddress = async (): Promise<string | null> => {
    try {
        console.log("🔍 Solicitando IP...");
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log("✅ IP obtenida:", data.ip);
        return data.ip;
    } catch (error) {
        console.error("❌ Error al obtener la IP:", error);
        return null;
    }
};