import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

const MainLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default MainLayout;