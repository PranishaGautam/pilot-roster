import React from 'react';

import dashboardStyles from '../../styles/dashboard.module.css';

const TopNavBar = () => {
	return (
		<div className={dashboardStyles.topBar}>
			<h1 className={dashboardStyles.pageTitle}>Himalaya Airlines</h1>
			<div className={dashboardStyles.topUserInfo}>
				<span className={dashboardStyles.userCircle}>PG</span>
				<span style={{ marginLeft: 8 }}>Pranisha Gautam</span>
			</div>
		</div>
	)
}

export default TopNavBar;