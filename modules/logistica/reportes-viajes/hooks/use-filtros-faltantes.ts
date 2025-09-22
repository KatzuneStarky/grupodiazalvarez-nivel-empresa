import { useState } from "react";

export const useFiltrosFaltantes = () => {
  const [descripcionSeleccionada, setDescripcionSeleccionada] = useState<string>("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>("");
  const [searchDescripcion, setSearchDescripcion] = useState<string>("");
  const [searchCliente, setSearchCliente] = useState<string>("");
  const [searchMunicipio, setSearchMunicipio] = useState<string>("");

  const [openDescripcion, setOpenDescripcion] = useState<boolean>(false);
  const [openCliente, setOpenCliente] = useState<boolean>(false);
  const [filterMaxMin, setFilterMaxMin] = useState<boolean>(false);

  return {
    descripcionSeleccionada,
    setDescripcionSeleccionada,
    clienteSeleccionado,
    setClienteSeleccionado,
    searchDescripcion,
    setSearchDescripcion,
    searchCliente,
    setSearchCliente,
    searchMunicipio,
    setSearchMunicipio,
    openDescripcion,
    setOpenDescripcion,
    openCliente,
    setOpenCliente,
    filterMaxMin,
    setFilterMaxMin,
  };
};