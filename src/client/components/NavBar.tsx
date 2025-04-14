import React, { useState, useMemo } from 'react';

import dashboardStyles from '../../styles/dashboard.module.css';

const NavBar = () => {

	const [activeItem, setActiveItem] = useState('Dashboard');

    return (
		<aside className={dashboardStyles.sidebar}>
			<div className={dashboardStyles.sidebarHeader}>
				<h2 className={dashboardStyles.udaanLogo}>Udaan</h2>
			</div>

			<nav className={dashboardStyles.nav}>
				<ul className={dashboardStyles.navList}>
					<li className={dashboardStyles.navItem}>
						<span className={dashboardStyles.navIcon}>🏠</span> Dashboard
					</li>
					<li className={dashboardStyles.navItem}>
						<span className={dashboardStyles.navIcon}>✈️</span> Routes
					</li>
					<li className={dashboardStyles.navItem}>
						<span className={dashboardStyles.navIcon}>📅</span> Schedules
					</li>
					<li className={dashboardStyles.navItem}>
						<span className={dashboardStyles.navIcon}>⚙️</span> Maintenance
					</li>
				</ul>
			</nav>

			<div className={dashboardStyles.sidebarFooter}>
				<div className={dashboardStyles.userBadge}>
				<span className={dashboardStyles.userInitials}>PG</span>
				<span style={{ marginLeft: 8 }}>Pranisha Gautam</span>
			</div>
			</div>
		</aside>
    )
}

export default NavBar;