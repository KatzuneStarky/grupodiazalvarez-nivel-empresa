export const getFuelTypeColor = (tipo: string) => {
    switch (tipo) {
        case "Diesel":
            return "bg-gray-500"
        case "Premium":
            return "bg-red-500"
        case "Regular":
            return "bg-green-500"
        case "Otro":
            return "bg-orange-500"
        default:
            return "bg-gray-500"
    }
}