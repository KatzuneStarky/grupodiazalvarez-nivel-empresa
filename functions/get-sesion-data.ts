import { DeviceInfo } from "@/types/sesion-data";

export const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;

    // Detectar navegador
    let browser = 'Unknown';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Detectar SO
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'MacOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Detectar tipo de dispositivo
    let deviceType: 'Movil' | 'Tablet' | 'Computadora' = 'Computadora';
    if (/Mobi|Android/i.test(userAgent)) deviceType = 'Movil';
    if (/Tablet|iPad/i.test(userAgent)) deviceType = 'Tablet';

    return {
        userAgent,
        platform: navigator.platform,
        screenResolution,
        browser,
        os,
        deviceType
    };
};