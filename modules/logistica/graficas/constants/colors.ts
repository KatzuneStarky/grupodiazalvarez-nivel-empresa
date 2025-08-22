type ProductColorMapping = {
    [key: string]: string;
}

export const colorMapping: ProductColorMapping = {
    'PEMEX MAGNA': 'rgb(0,165,81)',
    'PEMEX DIESEL': 'rgb(55,55,53)',
    'PEMEX PREMIUM': 'rgb(213,43,30)',
    'DIESEL INDUSTRIAL BA': 'rgb(129,149,155)',
    'DIESEL MARINO': 'rgb(0,122,136)',
    'DIESEL AUTOMOTRIZ': '#0678DC',
    '87 OCTANOS': 'rgb(0,165,81)',
    '91 OCTANOS': 'rgb(213,43,30)',
};

export const tailwindColorMapping: Record<string, string> = {
    'PEMEX MAGNA': 'bg-green-600',
    'PEMEX DIESEL': 'bg-gray-700',
    'PEMEX PREMIUM': 'bg-red-600',
    'DIESEL INDUSTRIAL BA': 'bg-gray-600',
    'DIESEL MARINO': 'bg-teal-600',
    'DIESEL AUTOMOTRIZ': 'bg-blue-600',
    '87 OCTANOS': 'bg-green-600',
    '91 OCTANOS': 'bg-red-600',
};