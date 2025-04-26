import FlightCrewAvailabilityTable from '../FlightCrewAvailabilityTable';

import dashboardStyles from '../../../styles/dashboard.module.css';

const CrewManagement = () => {
	return (
		<section className={dashboardStyles.crewSection}>
			<h2 className={dashboardStyles.sectionTitle}>Flight Crew Availability</h2>
			<FlightCrewAvailabilityTable />
		</section>
	)
}

export default CrewManagement;