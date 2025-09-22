export function getClientBorderColor(cliente: string): string {
    const clientColorMap: { [key: string]: string } = {
        'RALSI': 'border-cyan-400',
        'COBUSA': 'border-green-500',
        'DEFAULT': 'border-gray-300'
    }
    return clientColorMap[cliente] || clientColorMap['DEFAULT']
}