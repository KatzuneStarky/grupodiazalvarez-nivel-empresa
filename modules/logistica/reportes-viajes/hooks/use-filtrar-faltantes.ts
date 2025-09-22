import { useMemo } from "react";

export interface Faltante {
  Cliente: string;
  Descripciones: {
    DescripcionDelViaje: string;
    TotalA20: number;
    TotalNatural: number;
  }[];
}

export const useFiltrarFaltantes = (
  faltantesPorClienteYDescripcion: Faltante[],
  clienteSeleccionado: string,
  descripcionSeleccionada: string,
  searchCliente: string,
  searchDescripcion: string,
  filterMaxMin: boolean
) => {
  const clientes: string[] = useMemo(() => {
    const filtered = [...new Set(faltantesPorClienteYDescripcion.map(i => i.Cliente))];
    return filtered.filter(c => c.toLowerCase().includes(searchCliente.toLowerCase()));
  }, [faltantesPorClienteYDescripcion, searchCliente]);

  const descripciones: string[] = useMemo(() => {
    const all = faltantesPorClienteYDescripcion.flatMap(i =>
      i.Descripciones.map(d => d.DescripcionDelViaje)
    );
    const unique = [...new Set(all)];
    return unique.filter(d => d.toLowerCase().includes(searchDescripcion.toLowerCase()));
  }, [faltantesPorClienteYDescripcion, searchDescripcion]);

  const datosFiltrados: Faltante[] = useMemo(() => {
    let datos = [...faltantesPorClienteYDescripcion];

    if (clienteSeleccionado) {
      datos = datos.filter(item => item.Cliente === clienteSeleccionado);
    }

    if (descripcionSeleccionada) {
      datos = datos
        .map(item => ({
          ...item,
          Descripciones: item.Descripciones.filter(d =>
            d.DescripcionDelViaje.includes(descripcionSeleccionada)
          ),
        }))
        .filter(item => item.Descripciones.length > 0);
    }

    if (filterMaxMin) {
      datos = datos.map(item => {
        const maxSobranteA20 = Math.max(
          ...item.Descripciones.filter(d => d.TotalA20 >= 0).map(d => d.TotalA20),
          0
        );
        const minFaltanteA20 = Math.min(
          ...item.Descripciones.filter(d => d.TotalA20 < 0).map(d => d.TotalA20),
          0
        );

        const maxSobranteNatural = Math.max(
          ...item.Descripciones.filter(d => d.TotalNatural >= 0).map(d => d.TotalNatural),
          0
        );
        const minFaltanteNatural = Math.min(
          ...item.Descripciones.filter(d => d.TotalNatural < 0).map(d => d.TotalNatural),
          0
        );

        return {
          ...item,
          Descripciones: item.Descripciones.map(d => ({
            ...d,
            maxSobranteA20,
            minFaltanteA20,
            maxSobranteNatural,
            minFaltanteNatural,
          })),
        };
      });
    }

    return datos;
  }, [clienteSeleccionado, descripcionSeleccionada, faltantesPorClienteYDescripcion, filterMaxMin]);

  return { clientes, descripciones, datosFiltrados };
};