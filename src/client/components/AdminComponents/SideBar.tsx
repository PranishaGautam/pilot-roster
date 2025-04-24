import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';

import {
	Home, Calendar, AlertCircle, CloudSun,
	MessageCircle, LogOut, FileText, Settings
} from 'lucide-react';

import ConnectingAirportsOutlinedIcon from '@mui/icons-material/ConnectingAirportsOutlined';

import dashboardStyles from '../../../styles/dashboard.module.css'

import { useBackendActions } from '../../hooks/callBackend';
import { useAuth } from '../../context/AuthContext';
import { UserDetails } from '../../models/response-interface';
import { useNavigate } from 'react-router-dom';

interface Props {
	onSelect: (page: string) => void;
	activePage: string;
}

const SideBar = ({ onSelect, activePage }: Props) => {

	const { token, userId, role } = useAuth();
	const navigate = useNavigate();
	const { getUserDetailById } = useBackendActions();

	const [userDetails, setUserDetails] = useState<UserDetails>();

	useEffect(() => {
		if (userId && token) {
			getUserDetailById(userId, token, 'get-user-detail')
			.then((response) => {
				console.log('User Details:', response);
				if (response) {
					setUserDetails(response);
				}
			}).catch((error) => {
				console.error('Error fetching user details:', error);
			});
		}
	}, []);

	const handleLogOut = () => {
		navigate('/');
	}

	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'schedule', label: 'Schedules' },
		{ id: 'crew', label: 'Crew Management' },
		{ id: 'history', label: 'Flight History' },
	];

	const pilotMenuItems = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'requests', label: 'Requests' },
		{ id: 'notifications', label: 'Notifications' },
	];

	const itemsToDisplay = useMemo(() => {
		if (role === 'admin') {
			return menuItems;
		} else if (role === 'pilot') {
			return pilotMenuItems;
		}
		return [];
	}, [userDetails, role]);

	return (
		<div className={dashboardStyles.sidebar}>
			<div className={dashboardStyles.topItems}>

				<div className={dashboardStyles.profileIntroSection}>
					<div className={dashboardStyles.logoDiv}>
						<h2>Udaan</h2>
						<ConnectingAirportsOutlinedIcon className={dashboardStyles.logoIcon} />
					</div>

					<div className={dashboardStyles.profileSection}>
						<h3 className={dashboardStyles.pilotName}>
							{'Welcome Back'}
							{userDetails && (
								<>
									{','}
									<br/>
									{userDetails?.role === 'pilot' ? 'Capt. ' : ''}
									{`${userDetails?.first_name} ${userDetails?.last_name}`}
								</>
							)}
						</h3>
					</div>
				</div>
				

				<div className={dashboardStyles.items}>
					<ul>
						{
							itemsToDisplay.map(item => (
								<li key={item.id} onClick={() => onSelect(item.id)} className={(activePage === item.id) ? dashboardStyles.active : ''}>
									{item.label}
								</li>
							))
						}
					</ul>
				</div>
			</div>

			<div className={dashboardStyles.logoutContainer}>
				<SidebarItem icon={<LogOut size={18} />} label="Log Out" onClick={handleLogOut}/>
			</div>
		</div>
	);
};

export default SideBar;

const SidebarItem = ({ icon, label, active = false, onClick }: any) => (
	<div
		style={{
		display: 'flex',
		alignItems: 'center',
		backgroundColor: active ? '#2e3455' : 'transparent',
		color: '#fff',
		borderRadius: '6px',
		cursor: 'pointer',
		marginBottom: '0.5rem'
		}}
		onClick={onClick}
	>
    	{icon}
    	<span style={{ marginLeft: '10px' }}>{label}</span>
  	</div>
);