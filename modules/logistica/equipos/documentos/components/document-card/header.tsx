"use client"

import { getDocumentIcon } from "@/functions/get-document-icon";
import { CardHeader } from "@/components/ui/card";
import { FileVariant } from "../document-card"
import HeaderToolTip from "./header-tooltip";

const DocumentCardHeader = ({ file }: { file: FileVariant }) => {
    return (
        <CardHeader className="flex justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
                <HeaderToolTip file={file} />
                
                {file.tipo === "image" ? ( <img alt={file.ruta} width="40" height="540" src={file.ruta} /> ) 
                : ( <img src={getDocumentIcon(file.extension, file.tipo)} width="40" height="40" /> )}
                <h3 className="text-lg font-semibold">{file.nombre}</h3>
            </div>
        </CardHeader>
    )
}

export default DocumentCardHeader