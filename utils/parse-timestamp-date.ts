import { Timestamp } from "firebase/firestore"

export function parseFirebaseDate(
  fecha: Date | Timestamp | string | number | undefined
): Date {
  if (fecha instanceof Timestamp) {
    return fecha.toDate()
  }
  if (fecha instanceof Date && !isNaN(fecha.getTime())) {
    return fecha
  }
  if (typeof fecha === "string" || typeof fecha === "number") {
    const d = new Date(fecha)
    if (!isNaN(d.getTime())) return d
  }
  return new Date()
}