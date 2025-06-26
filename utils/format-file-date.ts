export const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
}