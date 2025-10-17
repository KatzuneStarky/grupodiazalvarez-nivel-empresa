"use client"

const DialogImage = ({
    imagen,
    marca,
    modelo
}: {
    imagen: string,
    marca: string,
    modelo: string
}) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <div className="h-1 w-8 bg-primary rounded-full" />
                Imagen del equipo
            </h3>

            {!imagen && (
                <div className="relative overflow-hidden rounded-xl bg-muted/50 border border-border">
                    <img
                        src={imagen || "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7"}
                        alt={`${marca} ${modelo}`}
                        className="object-cover object-center w-full h-full"
                    />
                </div>
            )}
        </>
    )
}

export default DialogImage