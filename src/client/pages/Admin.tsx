import React, { useState } from 'react';

import dashboardStyles from '../../styles/dashboard.module.css';
import NavBar from '../components/NavBar';
import DisplayCard from '../components/DisplayCard';
import SchedulesTable from '../components/SchedulesTable';
import FlightCrewAvailabilityTable from '../components/FlightCrewAvailabilityTable';
import TopNavBar from '../components/TopNavBar';

import Dashboard from '../components/AdminComponents/Dashboard';
import Schedule from '../components/AdminComponents/Schedule';
import CrewManagement from '../components/AdminComponents/CrewManagement';
import FlightHistory from '../components/AdminComponents/FlightHistory';
import Sidebar from '../components/AdminComponents/SideBar';

const Admin = () => {

	const [activePage, setActivePage] = useState('dashboard');

	const renderPage = () => {
		switch (activePage) {
			case 'dashboard': 
				return <Dashboard />;
			case 'schedule': 
				return <Schedule />;
			case 'crew': 
				return <CrewManagement />;
			case 'history': 
				return <FlightHistory />;
			default: 
				return <Dashboard />;
		}
	};

	return (
		<div className={dashboardStyles.container}>
			<Sidebar onSelect={setActivePage} activePage={activePage}/>
			<div className={dashboardStyles.mainContent}>
				<TopNavBar/>
				{renderPage()}
			</div>
			{/* <main className={dashboardStyles.mainContent}>
				<TopNavBar/>

				<Sidebar/>
				<div className={dashboardStyles.mainContent}>
					{renderPage()}
				</div>
			</main> */}
		</div>
	);
};

export default Admin;