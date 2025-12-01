"use client"

import { updateRolPermission, writeRoles } from "@/modules/administracion/actions/roles/write"
import { RolesSchema, RolesSchemaType } from "@/modules/administracion/schema/roles.schema"
import NewRolDialog from "@/modules/administracion/components/roles/new-rol-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAllRoles } from "@/modules/administracion/hooks/use-all-roles"
import { Plus, RefreshCcw, Save, Shield } from "lucide-react"
import SubmitButton from "@/components/global/submit-button"
import { ScrollArea } from "@/components/ui/scroll-area"
import PageTitle from "@/components/custom/page-title"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { RolesUsuario } from "@/types/roles-usuario"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "sonner"

const RolesPage = () => {
    const [selectedRole, setSelectedRole] = useState<RolesUsuario | null>(null)
    const [newRolDialog, setNewRolDialog] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const { allRoles } = useAllRoles()

    const handleSelectRole = (role: RolesUsuario) => {
        setSelectedRole(role)
    }

    const saveRolePermission = (id: string, permission: RolesUsuario['permisos']) => {
        try {
            setSubmitting(true)

            toast.promise(updateRolPermission(id, {
                crear: permission.crear ?? false,
                leer: permission.leer ?? false,
                actualizar: permission.actualizar ?? false,
                eliminar: permission.eliminar ?? false,
                aprobar: permission.aprobar ?? false,
                exportar: permission.exportar ?? false
            }), {
                loading: "Actualizando permisos...",
                success: "Permisos actualizados exitosamente",
                error: "Error al actualizar los permisos"
            })

            setSelectedRole(null)
        } catch (error) {
            console.log(error);
            toast.error("Error al actualizar los permisos")
        } finally {
            setSubmitting(false)
        }
    }

    const form = useForm<RolesSchemaType>({
        resolver: zodResolver(RolesSchema),
        defaultValues: {
            name: "",
            color: "",
            permisos: {
                crear: false,
                leer: false,
                actualizar: false,
                eliminar: false,
                aprobar: false,
                exportar: false
            },
            type: "Global",
            users: 1
        }
    })

    const onSubmit = (data: RolesSchemaType) => {
        try {
            setSubmitting(true)

            toast.promise(writeRoles(data), {
                loading: "Creando rol...",
                success: "Rol creado exitosamente",
                error: (error) => {
                    setSubmitting(false)
                    return error.message || "Error al registrar el rol.";
                },
            })

            form.setValue("color", "")
            form.reset()
            setNewRolDialog(false)
        } catch (error) {
            console.log(error);
            toast.error("Error al crear el rol", {
                description: `${error}`
            })
        } finally {
            setSubmitting(false)
        }
    }

    const hexToRgb = (hex: string) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    };

    return (
        <div className="container mx-auto py-6 px-8">
            <PageTitle
                title="Roles y permisos"
                description="Gestion de roles y permisos"
                icon={<Shield className="text-primary size-12" />}
                hasActions={true}
                actions={
                    <Button onClick={() => setNewRolDialog(true)}>
                        <Plus />
                        <span className="ml-2">Nuevo rol</span>
                    </Button>
                }
            />
            <Separator className="my-4" />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Roles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="space-y-2 h-[calc(100vh-30rem)] p-2">
                            {allRoles.length > 0 ? (
                                allRoles.map((role) => {
                                    const rgbColor = hexToRgb(role.color);

                                    return (
                                        <button
                                            key={role.id}
                                            className="flex w-full items-center cursor-pointer justify-between rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors mb-2"
                                            onClick={() => handleSelectRole(role)}
                                            style={{
                                                backgroundColor: `rgba(${rgbColor}, 0.1)`
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Shield className="h-5 w-5 text-primary" />
                                                <div className="text-left">
                                                    <p className="font-medium capitalize">{role.name.replace("_", " ")}</p>
                                                    <p className="text-xs text-muted-foreground">{role.users} usuarios</p>
                                                </div>
                                            </div>
                                            <Badge variant={role.type === "Global" ? "default" : "secondary"}>{role.type}</Badge>
                                        </button>
                                    )
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No se encontraron roles</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Crea un nuevo rol para empezar a gestionar permisos en tu aplicación.
                                    </p>
                                    <Button onClick={() => setNewRolDialog(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Nuevo Rol
                                    </Button>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Permisos</CardTitle>
                        <p className="text-sm text-muted-foreground">Configure permisos para cada rol</p>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="space-y-2 h-[calc(100vh-30rem)] p-2">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="pb-3 text-left text-sm font-medium">Rol</th>
                                        <th className="pb-3 text-center text-sm font-medium">Crear</th>
                                        <th className="pb-3 text-center text-sm font-medium">Leer</th>
                                        <th className="pb-3 text-center text-sm font-medium">Actualizar</th>
                                        <th className="pb-3 text-center text-sm font-medium">Eliminar</th>
                                        <th className="pb-3 text-center text-sm font-medium">Aprobar</th>
                                        <th className="pb-3 text-center text-sm font-medium">Exportar</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    {allRoles.length > 0 ? (
                                        allRoles.map((perm) => {
                                            const isSelected = selectedRole?.id === perm.id;
                                            const isDisabled = selectedRole !== null && !isSelected;
                                            const rgbColor = hexToRgb(perm.color);
                                            return (
                                                <tr
                                                    key={perm.id}
                                                    className={`border-b border-border transition-colors ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    style={{
                                                        background: isSelected ? `rgba(${rgbColor}, 0.5)` : ""
                                                    }}
                                                >
                                                    <td className="py-3 text-sm font-medium capitalize">
                                                        <span className="ml-4">
                                                            {perm.name.replace("_", " ")}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.crear : perm.permisos.crear}

                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, crear: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.leer : perm.permisos.leer}

                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, leer: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.actualizar : perm.permisos.actualizar}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, actualizar: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.eliminar : perm.permisos.eliminar}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, eliminar: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.aprobar : perm.permisos.aprobar}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, aprobar: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-3 text-center">
                                                        <Checkbox
                                                            checked={isSelected ? selectedRole?.permisos.exportar : perm.permisos.exportar}
                                                            disabled={isDisabled}
                                                            onCheckedChange={(checked) => {
                                                                if (isSelected && typeof checked === 'boolean') {
                                                                    setSelectedRole(prev => prev ? { ...prev, permisos: { ...prev.permisos, exportar: checked } } : null);
                                                                }
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                                                    <h3 className="text-lg font-semibold mb-2">No se encontraron roles</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Selecciona un rol para ver y configurar sus permisos.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </ScrollArea>
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedRole(null)}
                                disabled={submitting || allRoles.length === 0}
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Reiniciar
                            </Button>
                            <Button
                                onClick={() => saveRolePermission(selectedRole?.id || "", selectedRole?.permisos || {})}
                                disabled={submitting || allRoles.length === 0}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Guardar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <NewRolDialog
                open={newRolDialog}
                onOpenChange={setNewRolDialog}
                onSubmit={onSubmit}
                form={form}
                isSubmiting={submitting}
                submitButton={
                    <SubmitButton
                        isSubmiting={submitting}
                        loadingText="Guardando..."
                        text="Guardar"
                    />
                }
            />
        </div>
    )
}

export default RolesPage