import { Timestamp } from "firebase/firestore"
import { RolUsuario } from "@/enum/user-roles"

export interface SystemUser {
    uid: string
    nombre: string
    email: string
    rol: RolUsuario
    estado: "activo" | "inactivo" | "suspendido"
    tipoRegistro: "google" | "email" | "invitacion"
    empresaId?: string
    empleadoId?: string
    creadoEn: Timestamp
    actualizadoEn: Timestamp
    ultimoAcceso?: Timestamp

    // NUEVO: Información Profesional
    informacionProfesional?: {
        cargo?: string
        departamento?: string
        fechaIngreso?: Timestamp
        numeroEmpleado?: string
        supervisorId?: string
        supervisorNombre?: string
        ubicacionOficina?: string
        extension?: string
    }

    // NUEVO: Información de Contacto
    contacto?: {
        telefonoMovil?: string
        telefonoOficina?: string
        direccion?: {
            calle: string
            ciudad: string
            estado: string
            codigoPostal: string
            pais: string
        }
    }

    // NUEVO: Contacto de Emergencia
    contactoEmergencia?: {
        nombre: string
        telefono: string
        relacion: string
        email?: string
    }

    // NUEVO: Preferencias de Usuario
    preferencias?: {
        idioma: 'es' | 'en'
        zonaHoraria: string
        formatoFecha: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
        formatoHora: '12h' | '24h'
        notificaciones: {
            email: boolean
            push: boolean
            sms: boolean
        }
    }

    // NUEVO: Información de Logística (para conductores/operadores)
    logistica?: {
        licenciaConducir?: {
            numero: string
            tipo: string // A, B, C, D, E
            vencimiento: Timestamp
            estado: 'vigente' | 'por_vencer' | 'vencida'
            paisEmision: string
        }
        certificaciones: Array<{
            nombre: string
            numero?: string
            vencimiento?: Timestamp
            institucion?: string
        }>
        vehiculosAsignados: string[] // IDs de vehículos
        rutasFrecuentes: string[]
    }

    // NUEVO: Estadísticas de Actividad
    estadisticas?: {
        totalSesiones: number
        ultimosDispositivos: Array<{
            nombre: string
            navegador: string
            sistemaOperativo: string
            ultimoAcceso: Timestamp
            ip?: string
        }>
    }
}