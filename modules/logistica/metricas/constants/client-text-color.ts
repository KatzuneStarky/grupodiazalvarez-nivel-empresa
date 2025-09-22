export function getClientTextColor(clientName: string): string {
    switch (clientName) {
        case 'RALSI':
            return 'text-cyan-400';
        case 'COBUSA':
            return 'text-green-500';
        case 'BAJASUR':
            return 'text-red-500';
        case 'IBARRA HNOS':
            return 'text-indigo-400';
        case 'CFENERGIA':
            return 'text-green-500';
        case "MOLECULA DEL PACIFICO":
            return 'text-[#f59e0b]';
        default:
            return 'text-gray-500';
    }
}