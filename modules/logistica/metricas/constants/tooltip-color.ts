export function getColorClass(producto: string) {
    switch (producto) {
        case 'PEMEX PREMIUM':
            return 'text-red-500';
        case 'PEMEX MAGNA':
            return 'text-green-500';
        case 'PEMEX DIESEL':
            return 'text-black';
        default:
            return 'text-black';
    }
}