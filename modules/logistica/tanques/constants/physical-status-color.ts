export const getPhysicalStateColor = (estado?: string) => {
    switch (estado) {
      case "Bueno":
        return "bg-green-500"
      case "Regular":
        return "bg-yellow-500"
      case "Malo":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }