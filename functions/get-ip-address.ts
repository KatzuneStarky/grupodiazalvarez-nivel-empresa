// Lista de servicios de IP con fallback
const IP_SERVICES = [
    {
        name: 'ipify',
        url: 'https://api.ipify.org?format=json',
        parser: (data: any) => data.ip
    },
    {
        name: 'ipapi',
        url: 'https://ipapi.co/json/',
        parser: (data: any) => data.ip
    },
    {
        name: 'ip-api',
        url: 'http://ip-api.com/json/',
        parser: (data: any) => data.query
    }
];

export const getIpAddress = async (): Promise<string | null> => {
    console.log("🔍 Iniciando obtención de IP...");

    for (const service of IP_SERVICES) {
        try {
            console.log(`🌐 Intentando con ${service.name}...`);

            // Timeout de 5 segundos por servicio
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(service.url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`⚠️ ${service.name} respondió con status ${response.status}`);
                continue;
            }

            const data = await response.json();
            const ip = service.parser(data);

            if (ip && typeof ip === 'string') {
                console.log(`✅ IP obtenida exitosamente desde ${service.name}:`, ip);
                return ip;
            }

            console.warn(`⚠️ ${service.name} no retornó una IP válida`);
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    console.warn(`⏱️ Timeout en ${service.name}`);
                } else {
                    console.warn(`❌ Error con ${service.name}:`, error.message);
                }
            }
            // Continuar con el siguiente servicio
            continue;
        }
    }

    console.error("❌ No se pudo obtener la IP desde ningún servicio");
    return null;
};