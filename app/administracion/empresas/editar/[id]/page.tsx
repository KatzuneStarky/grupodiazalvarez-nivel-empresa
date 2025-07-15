"use client"

import { use } from "react";

const EditEmpresaPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = use(params);

    return (
        <div>
            {id}
        </div>
    )
}

export default EditEmpresaPage