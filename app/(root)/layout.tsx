import RootFooter from "@/modules/root/components/footer"
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
            <RootFooter />
        </div>
    )
}

export default RootLayout