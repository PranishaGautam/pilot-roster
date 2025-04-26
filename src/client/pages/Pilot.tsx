import { useState } from 'react';

import Sidebar from '../components/AdminComponents/SideBar';
import Notifications from '../components/PilotComponents/Notifications';
import PilotDashboard from '../components/PilotComponents/PilotDashboard';
import Requests from '../components/PilotComponents/Requests';
import TopNavBar from '../components/TopNavBar';

import dashboardStyles from '../../styles/dashboard.module.css';

const Pilot = () => {

	const [activePage, setActivePage] = useState('dashboard');
	
	const renderPage = () => {
		switch (activePage) {
			case 'dashboard': 
				return <PilotDashboard />;
			case 'requests':
				return <Requests />;
			case 'notifications':
				return <Notifications />;
			default: 
				return <PilotDashboard />;
		}
	};

	return (
		<div className={dashboardStyles.layout}>
			<Sidebar onSelect={setActivePage} activePage={activePage}/>

			<div className={dashboardStyles.mainContent}>
				<TopNavBar/>
				{renderPage()}
			</div>
		</div>
	);
};

export default Pilot;