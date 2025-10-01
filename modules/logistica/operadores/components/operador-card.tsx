"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Operador } from "../../bdd/operadores/types/operadores"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Button } from "@/components/ui/button"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useState } from "react"
import Image from "next/image"
import OperatorActions from "./operator-actions"

const OperadorCard = ({
    operator,
    getInitials,
    directLink
}: {
    operator: Operador,
    getInitials: (nombre: string, apellidos: string) => string,
    directLink: string
}) => {
    const [selectedOperator, setSelectedOperator] = useState<Operador | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleViewDetails = (operador: Operador) => {
        setSelectedOperator(operador)
        setIsModalOpen(true)
    }

    return (
        <>
            <div
                key={operator.id}
                className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border"
            >
                <div className="relative w-full h-48 bg-muted">
                    {operator.image ? (
                        <Image
                            src={operator.image || "/placeholder.svg"}
                            alt={`${operator.nombres} ${operator.apellidos}`}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <svg
                                className="w-20 h-20 text-muted-foreground"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2 text-balance">
                        {operator.nombres} {operator.apellidos}
                    </h3>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            <span>{operator.telefono}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="truncate">{operator.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <span>Licencia: {operator.tipoLicencia}</span>
                        </div>
                    </div>

                    {operator.contactosEmergencia && operator.contactosEmergencia.length > 0 && (
                        <div className="border-t border-border pt-4 mt-4">
                            <h4 className="text-sm font-semibold text-foreground mb-3">Contactos de Emergencia</h4>
                            <div className="space-y-2">
                                {operator.contactosEmergencia.map((contacto, index) => (
                                    <div key={index} className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                                        <div className="font-medium text-foreground">{contacto.nombre}</div>
                                        <div className="flex justify-between mt-1">
                                            <span className="italic">{contacto.relacion}</span>
                                            <span>{contacto.telefono}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-6 items-center place-items-center gap-2 mt-4 w-full">
                        <Button onClick={() => handleViewDetails(operator)} className="col-span-5 w-full" variant="outline">
                            Ver Todos los Datos
                        </Button>

                        <OperatorActions 
                            operador={operator}
                            directLink={directLink}
                            className=""
                        />
                    </div>
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {selectedOperator?.nombres} {selectedOperator?.apellidos}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOperator && (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <div className="relative w-48 h-48 rounded-lg overflow-hidden bg-muted">
                                    {selectedOperator.image ? (
                                        <Image
                                            src={selectedOperator.image || "/placeholder.svg"}
                                            alt={`${selectedOperator.nombres} ${selectedOperator.apellidos}`}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-24 h-24 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataField label="Nombres" value={selectedOperator.nombres} />
                                    <DataField label="Apellidos" value={selectedOperator.apellidos} />
                                    <DataField label="Teléfono" value={selectedOperator.telefono} />
                                    <DataField label="Email" value={selectedOperator.email} />
                                    <DataField label="NSS" value={selectedOperator.nss} />
                                    <DataField label="CURP" value={selectedOperator.curp} />
                                    <DataField label="INE" value={selectedOperator.ine} />
                                    <DataField label="Tipo de Sangre" value={selectedOperator.tipoSangre} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Dirección</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataField label="Calle" value={selectedOperator.calle} />
                                    <DataField label="Número Exterior" value={selectedOperator.externo.toString()} />
                                    <DataField label="Colonia" value={selectedOperator.colonia} />
                                    <DataField label="Código Postal" value={selectedOperator.cp.toString()} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Información de Licencia</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataField label="Número de Licencia" value={selectedOperator.numLicencia} />
                                    <DataField label="Tipo de Licencia" value={selectedOperator.tipoLicencia} />
                                    <DataField label="Emisor" value={selectedOperator.emisor} />
                                </div>
                            </div>

                            {selectedOperator.contactosEmergencia && selectedOperator.contactosEmergencia.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Contactos de Emergencia</h3>
                                    <div className="space-y-3">
                                        {selectedOperator.contactosEmergencia.map((contacto, index) => (
                                            <div key={index} className="bg-muted/50 rounded-lg p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <DataField label="Nombre" value={contacto.nombre} />
                                                    <DataField label="Relación" value={contacto.relacion} />
                                                    <DataField label="Teléfono" value={contacto.telefono} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Registro</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataField
                                        label="Fecha de Creación"
                                        value={format(parseFirebaseDate(selectedOperator.createdAt), "PPP", { locale: es })}
                                    />
                                    <DataField
                                        label="Última Actualización"
                                        value={format(parseFirebaseDate(selectedOperator.updatedAt), "PPP", { locale: es })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default OperadorCard

function DataField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-sm text-foreground">{value}</p>
        </div>
    )
}