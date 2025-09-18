"use client"

import { InventariosEstacionesSchema, InventariosEstacionesType } from "../../schemas/estacion-inventario.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createInventarioEstacion } from "../../actions/inventario/write";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/global/icon";
import { useForm } from "react-hook-form";
import { useState } from "react"
import { toast } from "sonner";
import { z } from "zod";

const InventariosEstacionesForm = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const form = useForm<InventariosEstacionesType>({
    resolver: zodResolver(InventariosEstacionesSchema),
    defaultValues: {
      estacion: "",
      inventarioDiesel: 0,
      inventarioManga: 0,
      inventarioPremium: 0,
      pVentasDiarias: 0,
      pVentasDiarias2: 0,
      pVentasDiarias3: 0
    },
  });

  const onSubmit = async (values: z.infer<typeof InventariosEstacionesSchema>) => {
    try {
      setIsSubmitting(true)

      toast.promise(createInventarioEstacion({
        estacion: values.estacion,
        inventarioDiesel: values.inventarioDiesel,
        inventarioMagna: values.inventarioManga,
        inventarioPremium: values.inventarioPremium,
        pVentasDiarias: values.pVentasDiarias,
        pVentasDiarias2: values.pVentasDiarias2,
        pVentasDiarias3: values.pVentasDiarias3
      }), {
        loading: "Creando inventario...",
        success: () => {
          form.reset()
          return "Inventario creado exitosamente"
        },
        error: (error) => {
          console.log(`Hubo un error al crear el inventario: ${error}`);
          return "Hubo un error al crear el inventario"
        }
      })
    } catch (error) {
      console.log(`Hubo un error al crear el inventario: ${error}`);
      toast.error("Hubo un error al crear el inventario", {
        description: `${error}`
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="estacion"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Estacion</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center w-full gap-4 mt-2">
          <FormField
            control={form.control}
            name="inventarioManga"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(0,165,81)]">Inventario Manga</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pVentasDiarias"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(0,165,81)]">Promedio Ventas Diarias</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-center w-full gap-4 mt-2">
          <FormField
            control={form.control}
            name="inventarioPremium"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(213,43,30)]">Inventario Premium</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pVentasDiarias2"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(213,43,30)]">Promedio Ventas Diarias</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-center w-full gap-4 mt-2">
          <FormField
            control={form.control}
            name="inventarioDiesel"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(55,55,53)]">Inventario Diesel</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pVentasDiarias3"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-[rgb(55,55,53)]">Promedio Ventas Diarias</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          color="default"
          className="mt-4 w-36 text-sm"
          disabled={isSubmitting}
        >
          <Icon iconName="material-symbols:save" />
          Guardar datos
        </Button>
      </form>
    </Form>
  )
}

export default InventariosEstacionesForm