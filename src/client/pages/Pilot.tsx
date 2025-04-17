import React from 'react';
import { Box, Grid } from '@mui/material';
import PilotStats from '../components/PilotStats';
import PilotScheduleTable from '../components/PilotScheduleTable';
import PilotRightPanel from '../components/PilotRightPanel';
import TopNavBar from '../components/TopNavBar';

import dashboardStyles from '../../styles/dashboard.module.css';
import pilotStyle from '../../styles/pilotpage.module.css';

const Pilot = () => {
	return (
		<div className={dashboardStyles.container}>
			<div className={dashboardStyles.mainContent}>
				<TopNavBar/>
				<div>
					{/* Pilot Stats Cards */}
					<PilotStats />

					{/* Layout for schedule & right panel */}
					<div className={pilotStyle.activitySection}>
						<Grid>
							{/* Pilot’s Individual Schedule */}
							<PilotScheduleTable />
						</Grid>
						<Grid>
							{/* Right-side requests & alerts panel */}
							<PilotRightPanel />
						</Grid>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Pilot