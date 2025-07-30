"use client"

import { use } from "react";

const AreaPage = ({ params }: { params: Promise<{ name: string }> }) => {
    const { name } = use(params);
    const decodedName = name ? decodeURIComponent(name) : '';

    return (
        <div>
            {decodedName}
        </div>
    )
}

export default AreaPage