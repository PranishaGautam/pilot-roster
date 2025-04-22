import React from 'react';

import dashboardStyles from '../../../styles/dashboard.module.css'

interface Props {
	onSelect: (page: string) => void;
	activePage: string;
}

const SideBar = ({ onSelect, activePage }: Props) => {
	
	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'schedule', label: 'Schedule' },
		{ id: 'crew', label: 'Crew Management' },
		{ id: 'history', label: 'Flight History' },
	];

	return (
		<div className={dashboardStyles.sidebar}>
		<h2>Udaan</h2>
		<ul>
			{menuItems.map(item => (
				<li key={item.id} onClick={() => onSelect(item.id)} className={(activePage === item.id) ? dashboardStyles.active : ''}>
					{item.label}
				</li>
			))}
		</ul>
		</div>
	);
};

export default SideBar;