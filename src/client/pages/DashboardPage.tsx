import React from 'react';

import dashboardStyles from '../../styles/dashboard.module.css';
import NavBar from '../components/NavBar';
import DisplayCard from '../components/DisplayCard';
import SchedulesTable from '../components/SchedulesTable';
import FlightCrewAvailabilityTable from '../components/FlightCrewAvailabilityTable';
import TopNavBar from '../components/TopNavBar';

const DashboardPage = () => {

	const cardDisplayContents = [
		{
			title: 'Passengers',
			value: 4823,
			percentageIndicator: 'positive',
			percentageChange: '16.9',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'Flights',
			value: 17,
			percentageIndicator: 'negative',
			percentageChange: '12',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'Waiting list',
			value: 400,
			percentageIndicator: 'positive',
			percentageChange: '4',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'Delays',
			value: 14,
			percentageIndicator: 'positive',
			percentageChange: '5',
			date: '2025-04-01 10:00:00',
		},
	]

	return (
		<div className={dashboardStyles.container}>
			{/* <NavBar /> */}

			{/* MAIN CONTENT AREA */}
			<main className={dashboardStyles.mainContent}>
				{/* TOP BAR */}
				<TopNavBar/>

				{/* ACTIVITY SECTION */}
				<section className={dashboardStyles.activitySection}>
					<h2 className={dashboardStyles.sectionTitle}>Activity</h2>
					<div className={dashboardStyles.activityCards}>
						{cardDisplayContents.map((content, index) => (
							<DisplayCard 
								key={index}
								cardTitle={content.title} 
								cardValue={content.value} 
								percentageIndicator={content.percentageIndicator} 
								percentageChange={content.percentageChange} 
								cardDate={content.date}						
							/>
						))}
					</div>
				</section>

				
				{/* FLIGHT SCHEDULE SECTION */}
				<section>
					<h2 className={dashboardStyles.sectionTitle}>Flight Schedules</h2>
					<SchedulesTable />
				</section>

				{/* FLIGHT CREW AVAILABILITY */}
				<section className={dashboardStyles.crewSection}>
					<h2 className={dashboardStyles.sectionTitle}>Flight Crew Availability</h2>
					<FlightCrewAvailabilityTable />
				</section>

			</main>
		</div>
	);
};

export default DashboardPage;