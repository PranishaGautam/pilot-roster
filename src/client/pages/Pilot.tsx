import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Home, Calendar, AlertCircle, CloudSun,
  MessageCircle, LogOut, FileText, Settings,
  Pi
} from 'lucide-react';

import Sidebar from '../components/AdminComponents/SideBar';

import dashboardStyles from '../../styles/dashboard.module.css';

import notificationIcon from '../../assets/notification.png';
import reportIssueIcon from '../../assets/reportissue.png';
import requestLeaveIcon from '../../assets/requestleave.png';
import viewScheduleIcon from '../../assets/viewfullschedule.png';
import SchedulesTable from '../components/SchedulesTable';

import { useAuth } from '../context/AuthContext';
import TopNavBar from '../components/TopNavBar';
import Requests from '../components/PilotComponents/Requests';
import Notifications from '../components/PilotComponents/Notifications';
import PilotDashboard from '../components/PilotComponents/PilotDashboard';

const Pilot: React.FC = () => {

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

	const [dropdownOpen, setDropdownOpen] = useState(false);
	// const [pushEnabled, setPushEnabled] = useState(true);
	// const [unreadCount, setUnreadCount] = useState(3);

	// const notifications = [
	// 	'Flight FL321 delayed by 25 mins',
	// 	'Weather alert on MIA route',
	// 	'New flight plan uploaded',
	// ];

  	// const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

	return (
		<div style={styles.layout}>
			{/* Sidebar */}
			{/* <aside style={styles.sidebar}>
				<div style={styles.profileSection}>
					<img src="/pilot.jpg" alt="Pilot" style={styles.avatar} />
					<h2 style={styles.pilotName}>Welcome Back,<br />Capt. XXX</h2>
				</div>

				<nav style={styles.navList}>
					<SidebarItem icon={<Home size={18} />} label="Dashboard" active />
					<SidebarItem icon={<Calendar size={18} />} label="My Flights" />
					<SidebarItem icon={<AlertCircle size={18} />} label="Reports" />
					<SidebarItem icon={<CloudSun size={18} />} label="Weather" />
					<SidebarItem icon={<MessageCircle size={18} />} label="Messages" />
					<SidebarItem icon={<FileText size={18} />} label="Documents" />
					<SidebarItem icon={<Settings size={18} />} label="Settings" />
				</nav>

				<div style={styles.logoutContainer}>
					<SidebarItem icon={<LogOut size={18} />} label="Log Out" />
				</div>
			</aside> */}
			<Sidebar onSelect={setActivePage} activePage={activePage}/>

			<div className={dashboardStyles.mainContent}>
				<TopNavBar/>
				{renderPage()}
			</div>

			{/* Main Content */}
			{/* <main style={styles.contentArea}> */}
				
				{/* 🔔 Notification Bar */}
				{/* <div style={styles.headerBar}>
				<div style={styles.notificationContainer} onClick={toggleDropdown}>
					<img src={notificationIcon} alt="Notifications" style={styles.notificationIcon} />
					{unreadCount > 0 && <div style={styles.badge}>{unreadCount}</div>}
				</div> */}

				{/* {dropdownOpen && (
					<div style={styles.dropdown}>
						<p style={styles.dropdownTitle}>Recent Notifications</p>
						<ul>
							{notifications.map((note, idx) => (
							<li key={idx} style={styles.dropdownItem}>{note}</li>
							))}
						</ul>
						<div style={styles.pushToggle}>
							<label>
							<input
								type="checkbox"
								checked={pushEnabled}
								onChange={() => setPushEnabled(!pushEnabled)}
							/> Enable Push Notifications
							</label>
						</div>
					</div>
				)}
				</div> */}

				{/* Dashboard Overview */}
				{/* <div style={styles.topRow}>
					<DashboardCard title="Next Duty" value="Apr 10, 08:00" color="#4e89ff" />
					<DashboardCard title="Total Hours" value="1,530 hrs" color="#ffd76d" />
					<DashboardCard title="Pending Reports" value="2" color="#ff6b6b" />
				</div>

				<div style={styles.bottomGrid}>
					<div style={styles.leftPanel}>
						<h3 style={styles.sectionTitle}>This Week's Flights</h3>
						<SchedulesTable/>
					</div>

					<div style={styles.rightPanel}>
						<h3 style={styles.sectionTitle}>Quick Actions</h3>
						<div style={styles.quickActions}>
						<ActionCard icon={requestLeaveIcon} label="Request Leave" onClick={() => navigate('/request-leave')} />
						<ActionCard icon={reportIssueIcon} label="Report Issue" onClick={() => navigate('/report-issue')} />
						<ActionCard icon={viewScheduleIcon} label="View Full Schedule" onClick={() => navigate('/view-schedule')} />
						</div>

						<h3 style={{ ...styles.sectionTitle, marginTop: '2rem' }}>Recent Alerts</h3>
						<ul style={styles.alertList}>
						<li>✔️ Flight FL436 schedule updated</li>
						<li>⚠️ Weather alert for MIA route</li>
						<li>📄 Flight plan updated for FL321</li>
						<li>✅ Medical Certificate verified</li>
						</ul>
					</div>
				</div> */}
			{/* </main> */}
		</div>
	);
};

const SidebarItem = ({ icon, label, active = false }: any) => (
	<div
		style={{
		display: 'flex',
		alignItems: 'center',
		padding: '0.7rem 1rem',
		backgroundColor: active ? '#2e3455' : 'transparent',
		color: '#fff',
		borderRadius: '6px',
		cursor: 'pointer',
		marginBottom: '0.5rem'
		}}
	>
    	{icon}
    	<span style={{ marginLeft: '10px' }}>{label}</span>
  	</div>
);

const DashboardCard = ({ title, value, color }: any) => (
	<div
		style={{
		backgroundColor: color,
		borderRadius: '12px',
		color: '#fff',
		padding: '1rem 1.5rem',
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
		}}
	>
    	<h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{title}</h4>
    	<strong style={{ fontSize: '1.5rem' }}>{value}</strong>
  	</div>
);

const ActionCard = ({ icon, label, onClick }: any) => (
	<div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={onClick}>
		<img src={icon} alt={label} style={{ width: '48px', height: '48px', marginBottom: '0.5rem' }} />
		<div>{label}</div>
	</div>
);

const styles: { [key: string]: React.CSSProperties } = {
	layout: {
		display: 'flex',
		minHeight: '100vh',
		backgroundColor: '#a9dfbf',
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
	},
	sidebar: {
		width: '250px',
		backgroundColor: '#1e1e2f',
		color: 'white',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '1rem',
	},
	profileSection: {
		textAlign: 'center',
		marginBottom: '2rem',
	},
	avatar: {
		width: '60px',
		height: '60px',
		borderRadius: '50%',
		objectFit: 'cover',
		marginBottom: '0.5rem',
	},
	pilotName: {
		fontSize: '1rem',
		fontWeight: 500,
	},
	navList: {
		display: 'flex',
		flexDirection: 'column',
	},
	logoutContainer: {
		marginTop: 'auto',
	},
	contentArea: {
		flex: 1,
		padding: '2rem',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
	},
	headerBar: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingBottom: '1rem',
		position: 'relative',
	},
	notificationContainer: {
		position: 'relative',
		cursor: 'pointer',
		marginRight: '1rem',
	},
	notificationIcon: {
		width: '28px',
		height: '28px',
	},
	badge: {
		position: 'absolute',
		top: '-5px',
		right: '-5px',
		backgroundColor: '#ff3b3b',
		borderRadius: '50%',
		color: '#fff',
		width: '18px',
		height: '18px',
		fontSize: '0.75rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	dropdown: {
		position: 'absolute',
		top: '40px',
		right: '0',
		backgroundColor: '#fff',
		color: '#333',
		borderRadius: '8px',
		width: '280px',
		boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
		zIndex: 10,
		padding: '1rem',
	},
	dropdownTitle: {
		fontWeight: 600,
		marginBottom: '0.5rem',
	},
	dropdownItem: {
		padding: '0.25rem 0',
		borderBottom: '1px solid #eee',
		fontSize: '0.9rem',
	},
	pushToggle: {
		marginTop: '1rem',
		fontSize: '0.85rem',
	},
	topRow: {
		display: 'flex',
		gap: '1.5rem',
		marginBottom: '2rem',
	},
	bottomGrid: {
		display: 'flex',
		gap: '2rem',
	},
	leftPanel: {
		flex: 2,
		backgroundColor: '#fff',
		borderRadius: '12px',
		padding: '1rem',
	},
	rightPanel: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: '12px',
		padding: '1rem',
	},
	sectionTitle: {
		fontSize: '1.1rem',
		fontWeight: 600,
		marginBottom: '1rem',
	},
	flightChart: {
		width: '100%',
		height: '180px',
		objectFit: 'contain',
	},
	quickActions: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	alertList: {
		marginTop: '1rem',
		paddingLeft: '1rem',
		lineHeight: 1.6,
	},
};

export default Pilot;