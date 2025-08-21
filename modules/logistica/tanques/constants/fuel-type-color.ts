export const getFuelTypeColor = (tipo: string) => {
    switch (tipo) {
        case "Diesel":
            return "bg-blue-500"
        case "Gasolina":
            return "bg-red-500"
        case "Otro":
            return "bg-gray-500"
        default:
            return "bg-gray-500"
    }
}