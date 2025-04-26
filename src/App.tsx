import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import MainLayout from './client/layouts/MainLayout';
import Admin from './client/pages/Admin';
import LoginPage from './client/pages/LoginPage';
import Pilot from './client/pages/Pilot';
import RegisterPage from './client/pages/RegisterPage';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<MainLayout />}>
			<Route index element={<LoginPage />}/>
			<Route path='register' element={<RegisterPage />}/>
			<Route path='dashboard' element={<Admin />}/>
			<Route path='pilot' element={<Pilot />}/>
		</Route>
	)
)

const App = () => {
    return (
       <RouterProvider router={router}/>
    )
}

export default App;