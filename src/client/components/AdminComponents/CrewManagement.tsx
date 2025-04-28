import FlightCrewAvailabilityTable from '../FlightCrewAvailabilityTable';

import dashboardStyles from '../../../styles/dashboard.module.css';
import { ScheduleTableData } from '../../models/schedule-interface';
import { PilotResponse } from '../../models/response-interface';

interface Props {
	scheduleDataProp: Array<ScheduleTableData>;
	pilotListProp: Array<PilotResponse>;
}

const CrewManagement = ({ scheduleDataProp, pilotListProp }: Props) => {
	return (
		<section className={dashboardStyles.crewSection}>
			<h2 className={dashboardStyles.sectionTitle}>Flight Crew Availability</h2>
			<FlightCrewAvailabilityTable 
				scheduleDataProp={scheduleDataProp} 
				pilotListProp={pilotListProp}
			/>
		</section>
	)
}

export default CrewManagement;