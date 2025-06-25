"use client"

import { Icon as IconComponent } from '@iconify/react/dist/iconify.js'

const Icon = ({
    iconName,
    className,
    style,
    width,
    height
}: {
    iconName: string
    className?: string
    width?: number
    height?: number,
    style?: React.CSSProperties
}) => {
    return (
        <IconComponent
            icon={iconName}
            width={width ? width : 24}
            height={height ? height : 24}
            className={className}
            style={style}
        />
    )
}

export default Icon