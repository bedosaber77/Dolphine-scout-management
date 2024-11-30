import { Outlet } from "react-router-dom"
import AppHeader from "./AppHeader"

const MainLayout = () => {
    return (
        <div className="mainLayout">
            <header>
                <AppHeader></AppHeader>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout