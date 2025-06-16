import RootNavbar from "@/modules/root/components/navbar"

const RootLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
            <RootNavbar />
            {children}
        </div>
    )
}

export default RootLayout