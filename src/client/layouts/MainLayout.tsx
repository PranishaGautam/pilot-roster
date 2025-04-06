import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';

const MainLayout = () => {
    return (
        <AuthProvider>
            <ToastContainer />
            <Outlet />
        </AuthProvider>
    )
}

export default MainLayout;