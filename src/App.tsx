import React from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import MainLayout from './client/layouts/MainLayout';
import Home from './client/pages/Home';
import Admin from './client/pages/Admin';
import Pilot from './client/pages/Pilot';
import LoginPage from './client/pages/LoginPage';
import RegisterPage from './client/pages/RegisterPage';
import DashboardPage from './client/pages/DashboardPage';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<MainLayout />}>
			<Route index element={<LoginPage />}/>
			<Route path='register' element={<RegisterPage />}/>
			<Route path='dashboard' element={<DashboardPage />}/>
			<Route path='pilot' element={<Pilot />}/>
			<Route path='admin' element={<Admin />}/>
		</Route>
	)
)

const App = () => {
    return (
       <RouterProvider router={router}/>
    )
}

export default App;