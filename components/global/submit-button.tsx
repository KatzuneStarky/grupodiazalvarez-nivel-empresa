"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "../ui/button"

interface SubmitButtonProps {
    isSubmiting: boolean,
    loadingText: string,
    text: string
}

const SubmitButton = ({
    isSubmiting,
    loadingText,
    text
}: SubmitButtonProps) => {
    return (
        <Button type="submit" disabled={isSubmiting}>
            {isSubmiting ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {loadingText}
                </>
            ) : (
                <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {text}
                </>
            )}
        </Button>
    )
}

export default SubmitButton