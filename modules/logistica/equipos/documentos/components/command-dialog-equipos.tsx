"use client"

import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { useEmpresa } from "@/context/empresa-context"
import { useArea } from "@/context/area-context"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

interface props {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    equipos: Equipo[]
}

export const CommandDialogEquipos = ({ open, setOpen, equipos }: props) => {
    const { empresa } = useEmpresa()
    const { area } = useArea()

    const link = `/${empresa?.nombre}/${area?.nombre}/equipos`

    return (
        <CommandDialog open={open} onOpenChange={setOpen} className="w-96">
            <CommandInput
                placeholder="Busque el equipo aqui"
            />
            <CommandList>
                <CommandEmpty>
                    No se encontro ese equipo
                </CommandEmpty>
                <CommandGroup heading="Equipos">
                    {equipos.map((e) => (
                        <CommandItem
                            key={e.id}
                        >
                            <a href={`${link}/${e.id}`}>
                                {e.numEconomico} - {e.marca} - {e.modelo}
                            </a>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}