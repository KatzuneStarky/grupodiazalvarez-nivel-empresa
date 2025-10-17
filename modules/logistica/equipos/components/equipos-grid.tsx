"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EstadoEquipos } from "../../bdd/equipos/enum/estado-equipos"
import { parseFirebaseDate } from "@/utils/parse-timestamp-date"
import { Calendar, MapPin, Shield, Truck } from "lucide-react"
import { Equipo } from "../../bdd/equipos/types/equipos"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QRCodeCanvas } from "qrcode.react"
import Icon from "@/components/global/icon"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import { useRef } from "react"
import DialogImage from "./dialog-image"
import DeailogQr from "./dialog-qr"

interface EquipoGridProps {
    equipos: Equipo[]
    loading?: boolean,
    handleCardClick: (equipo: Equipo) => void
    selectedEquipo: Equipo | null,
    setSelectedEquipo: (equipo: Equipo | null) => void,
    getEstadoBadgeVariant: (estado: EstadoEquipos) => "default" | "secondary" | "destructive" | "outline" | null
}

const EquiposGrid = ({
    equipos,
    loading,
    handleCardClick,
    selectedEquipo,
    setSelectedEquipo,
    getEstadoBadgeVariant
}: EquipoGridProps) => {
    const qrCodeRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {equipos.map((equipo) => (
                    <Card
                        className="cursor-pointer group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
                        onClick={() => handleCardClick(equipo)}
                        key={equipo.id}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 
                        via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity 
                        duration-500" />

                        <div className={`absolute top-0 left-0 right-0 h-1 
                        ${equipo.estado === EstadoEquipos.DISPONIBLE
                                ? "bg-gradient-to-r from-emerald-500 to-green-400"
                                : equipo.estado === EstadoEquipos.EN_TALLER
                                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                    : equipo.estado === EstadoEquipos.FUERA_DE_SERVICIO
                                        ? "bg-gradient-to-r from-slate-500 to-gray-400"
                                        : "bg-gradient-to-r from-red-500 to-rose-400"}`}
                        />

                        <CardHeader className="pb-3 relative z-10">
                            <div className="flex items-start justify-between mb-3">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                        {equipo.numEconomico}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground/80 font-medium">
                                        {equipo.marca} • {equipo.modelo}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full 
                                    ${equipo.gpsActivo
                                            ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                                            : "bg-slate-400"} 
                                    transition-all duration-300`}
                                    />
                                    <span className="text-xs text-muted-foreground">{equipo.gpsActivo ? "GPS" : "GPS Desactivado"}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                    <Calendar className="h-3 w-3" />
                                    <span className="font-medium">{equipo.year}</span>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={`text-xs font-medium border-0 ${equipo.estado === EstadoEquipos.DISPONIBLE
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : equipo.estado === EstadoEquipos.EN_TALLER
                                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : equipo.estado === EstadoEquipos.FUERA_DE_SERVICIO
                                                ? "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                                        }`}
                                >
                                    {equipo.estado}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 relative z-10">
                            {!equipo.imagen && (
                                <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-muted/30 border border-border/30 group-hover:border-primary/20 transition-colors duration-300">
                                    <img
                                        src={equipo.imagen || "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7"}
                                        alt={`${equipo.marca} ${equipo.modelo}`}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {equipo.tipoUnidad && (
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <div className="bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5 text-xs text-white font-medium border border-white/10">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-3 w-3" />
                                                    {equipo.tipoUnidad}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                                        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                            <Truck className="h-3 w-3 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted-foreground/70 truncate">Grupo</p>
                                            <p className="text-xs font-medium truncate">{equipo.grupoUnidad}</p>
                                        </div>
                                    </div>

                                    {equipo.m3 && (
                                        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20 border border-border/30">
                                            <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                                                <Icon iconName="mdi:train-car-tank" className="h-3 w-3 text-primary" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground/70">Capacidad</p>
                                                <p className="text-xs font-medium">{equipo.m3} m³</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                                            <span>{equipo.tanque.length} Tanque{equipo.tanque.length === 0 || equipo.tanque.length > 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                            <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                                            <span>{equipo.mantenimiento.length} Mantenimiento{equipo.mantenimiento.length === 0 || equipo.mantenimiento.length > 1 ? "s" : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={!!selectedEquipo} onOpenChange={() => setSelectedEquipo(null)}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-border">
                    <DialogHeader className="border-b border-border pb-4">
                        <DialogTitle className="text-2xl font-bold flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Truck className="h-4 w-4 text-primary" />
                                </div>
                                {selectedEquipo?.numEconomico} - {selectedEquipo?.marca} {selectedEquipo?.modelo}
                            </div>

                            <Badge variant={getEstadoBadgeVariant(selectedEquipo?.estado as EstadoEquipos)} className="font-medium">
                                {selectedEquipo?.estado}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
                        <div className="lg:col-span-1 space-y-6">
                            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                <div className="h-1 w-8 bg-primary rounded-full" />
                                Acciones
                            </h3>

                            <div>
                                <Button>
                                    Ver Docs
                                </Button>
                            </div>

                            <DialogImage
                                imagen={selectedEquipo?.imagen || ""}
                                marca={selectedEquipo?.marca || ""}
                                modelo={selectedEquipo?.modelo || ""}
                            />

                            <DeailogQr
                                id={selectedEquipo?.id || ""}
                                numEconomico={selectedEquipo?.numEconomico || ""}
                                serie={selectedEquipo?.serie || ""}
                                qrCodeRef={qrCodeRef}
                            />

                            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-muted/30 border border-border">
                                <div className={`h-3 w-3 rounded-full ${selectedEquipo?.gpsActivo ? "bg-primary" : "bg-destructive"}`} />
                                <span className="text-sm font-medium">GPS {selectedEquipo?.gpsActivo ? "Conectado" : "Desconectado"}</span>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                    <div className="h-1 w-8 bg-primary rounded-full" />
                                    Información Básica
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        ["Número Económico", selectedEquipo?.numEconomico],
                                        ["Marca", selectedEquipo?.marca],
                                        ["Modelo", selectedEquipo?.modelo],
                                        ["Año", selectedEquipo?.year.toString()],
                                        ["Serie", selectedEquipo?.serie],
                                        ["Placas", selectedEquipo?.placas],
                                        ["Grupo", selectedEquipo?.grupoUnidad],
                                        ["Tipo de Unidad", selectedEquipo?.tipoUnidad],
                                    ]
                                        .filter(([_, value]) => value)
                                        .map(([label, value]) => (
                                            <div key={label} className="p-3 rounded-lg bg-muted/20 border border-border">
                                                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                                                <div className="font-medium">{value}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                    <div className="h-1 w-8 bg-primary rounded-full" />
                                    Información Técnica
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        ["Capacidad (m³)", selectedEquipo?.m3],
                                        ["Tipo de Tanque", selectedEquipo?.tipoTanque],
                                        ["Rendimiento (km/L)", selectedEquipo?.rendimientoPromedioKmPorLitro?.toString()],
                                    ]
                                        .filter(([_, value]) => value)
                                        .map(([label, value]) => (
                                            <div key={label} className="p-3 rounded-lg bg-muted/20 border border-border">
                                                <div className="text-xs text-muted-foreground mb-1">{label}</div>
                                                <div className="font-medium">{value}</div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {selectedEquipo?.seguro && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        <div className="h-1 w-8 bg-primary rounded-full" />
                                        Seguro
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            ["Póliza", selectedEquipo?.seguro.numeroPoliza],
                                            ["Aseguradora", selectedEquipo?.seguro.aseguradora],
                                            ["Vigencia", format(parseFirebaseDate(selectedEquipo?.seguro.vigenciaHasta), "PPP", { locale: es })],
                                            ["Cobertura", selectedEquipo?.seguro.tipoCobertura],
                                        ]
                                            .filter(([_, value]) => value)
                                            .map(([label, value], index) => (
                                                <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border">
                                                    <div className="text-xs text-muted-foreground mb-1">{label}</div>
                                                    <div className="font-medium">{value}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {selectedEquipo?.ultimaUbicacion && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <div className="h-1 w-8 bg-primary rounded-full" />
                                        Última Ubicación
                                    </h3>
                                    <div className="p-4 rounded-lg bg-muted/20 border border-border space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Fecha:</span>
                                            <span className="font-medium">
                                                {format(parseFirebaseDate(selectedEquipo?.ultimaUbicacion.fecha), "PPP", { locale: es })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Coordenadas:</span>
                                            <span className="font-mono text-sm">
                                                {selectedEquipo?.ultimaUbicacion.latitud}, {selectedEquipo?.ultimaUbicacion.longitud}
                                            </span>
                                        </div>
                                        {selectedEquipo?.ultimaUbicacion.direccionAproximada && (
                                            <div className="pt-2 border-t border-border">
                                                <span className="text-sm text-muted-foreground">Dirección:</span>
                                                <p className="font-medium mt-1">{selectedEquipo?.ultimaUbicacion.direccionAproximada}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EquiposGrid