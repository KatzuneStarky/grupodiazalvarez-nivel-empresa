import { ClienteViajes, DescripcionDelViaje } from "../types/reporte-viajes";
import { obtenerSumaM3PorProductoYViaje } from "../actions/read";
import { useEffect, useState } from "react";

interface Comparacion {
    descripcion1: DescripcionDelViaje & { sumaM3: number };
    descripcion2: DescripcionDelViaje & { sumaM3: number };
    diferenciaM3: number;
}

export interface ClienteViajesConComparacion extends ClienteViajes {
    Comparacion?: Comparacion;
}

interface UseViajesProps {
    mes: string
    selectedYear: number
    sumaM3PorProductoYViaje: ClienteViajes[];
}

export const useMetricasComparativaEstaciones = ({ sumaM3PorProductoYViaje, mes, selectedYear }: UseViajesProps) => {
    const [datosFiltrados, setDatosFiltrados] = useState<ClienteViajes[]>([]);
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [searchDescripcion, setSearchDescripcion] = useState('');
    const [searchMunicipio, setSearchMunicipio] = useState('');
    const [searchCliente, setSearchCliente] = useState('');

    const [selectedDescripcion1, setSelectedDescripcion1] = useState<string>("");
    const [selectedDescripcion2, setSelectedDescripcion2] = useState<string>("");
    const [comparacionResultado, setComparacionResultado] = useState<ClienteViajesConComparacion[]>([]);

    const filtrarMaximosPorCombustible = (datos: ClienteViajes[]): ClienteViajes[] => {
        return datos.map(cliente => {
            const productosMaximosPorTipo: Record<string, { descripcion: string; cantidad: number }> = {};

            cliente.DescripcionesDelViaje.forEach(desc => {
                Object.entries(desc.Productos).forEach(([producto, cantidad]) => {
                    if (!productosMaximosPorTipo[producto] || cantidad > productosMaximosPorTipo[producto].cantidad) {
                        productosMaximosPorTipo[producto] = { descripcion: desc.Descripcion, cantidad };
                    } else if (cantidad === productosMaximosPorTipo[producto].cantidad) {
                        productosMaximosPorTipo[producto].descripcion += `, ${desc.Descripcion}`;
                    }
                });
            });

            const descripcionesFiltradas: DescripcionDelViaje[] = Object.entries(productosMaximosPorTipo).map(
                ([producto, { descripcion, cantidad }]) => ({
                    Descripcion: descripcion,
                    Productos: { [producto]: cantidad },
                })
            );

            return {
                Cliente: cliente.Cliente,
                DescripcionesDelViaje: descripcionesFiltradas,
            };
        });
    };

    useEffect(() => {
        let datos = [...sumaM3PorProductoYViaje];

        if (searchCliente) {
            datos = datos.filter(c => c.Cliente.toLowerCase().includes(searchCliente.toLowerCase()));
        }

        if (searchDescripcion) {
            datos = datos.map(c => ({
                ...c,
                DescripcionesDelViaje: c.DescripcionesDelViaje.filter(d =>
                    d.Descripcion.toLowerCase().includes(searchDescripcion.toLowerCase())
                ),
            })).filter(c => c.DescripcionesDelViaje.length > 0);
        }

        if (searchMunicipio) {
            datos = datos.map(c => ({
                ...c,
                DescripcionesDelViaje: c.DescripcionesDelViaje.filter(d =>
                    Object.keys(d.Productos).some(() => true)
                ),
            }));
        }

        if (isCheckboxChecked) {
            datos = filtrarMaximosPorCombustible(datos);
        }

        if (selectedDescripcion1 || selectedDescripcion2) {
            datos = datos.map(cliente => ({
                ...cliente,
                DescripcionesDelViaje: cliente.DescripcionesDelViaje.filter(d =>
                    d.Descripcion === selectedDescripcion1 || d.Descripcion === selectedDescripcion2
                ),
            })).filter(cliente => cliente.DescripcionesDelViaje.length > 0);
        }

        setDatosFiltrados(datos);        

    }, [
        sumaM3PorProductoYViaje,
        searchCliente,
        searchDescripcion,
        searchMunicipio,
        isCheckboxChecked,
        selectedDescripcion1,
        selectedDescripcion2,
    ]);

    return {
        datosFiltrados,
        searchCliente,
        setSearchCliente,
        searchDescripcion,
        setSearchDescripcion,
        searchMunicipio,
        setSearchMunicipio,
        isCheckboxChecked,
        setIsCheckboxChecked,
        selectedDescripcion1,
        setSelectedDescripcion1,
        selectedDescripcion2,
        setSelectedDescripcion2,
        comparacionResultado,
    };
}