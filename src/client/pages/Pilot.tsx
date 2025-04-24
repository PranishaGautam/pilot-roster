import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/AdminComponents/SideBar';
import TopNavBar from '../components/TopNavBar';
import Requests from '../components/PilotComponents/Requests';
import Notifications from '../components/PilotComponents/Notifications';
import PilotDashboard from '../components/PilotComponents/PilotDashboard';

import dashboardStyles from '../../styles/dashboard.module.css';

import { useAuth } from '../context/AuthContext';


const Pilot = () => {

	const { token, userId, role, pilotId } = useAuth();
	const navigate = useNavigate();

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