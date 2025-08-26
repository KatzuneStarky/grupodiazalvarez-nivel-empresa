"use client"

import { Equipo } from "@/modules/logistica/bdd/equipos/types/equipos"
import { directLink } from "@/constants/links"
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
    const ruta = directLink("/equipos")

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
                            <a href={`${ruta}/${e.id}`}>
                                {e.numEconomico} - {e.marca} - {e.modelo}
                            </a>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}