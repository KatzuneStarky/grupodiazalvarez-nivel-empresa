import { AnimatedToggleMode } from '@/components/global/animated-toggle-mode'
import React from 'react'

const EmpresasLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
            <div className='absolute top-2 right-2'>
                <AnimatedToggleMode />
            </div>
            {children}
        </div>
    )
}

export default EmpresasLayout