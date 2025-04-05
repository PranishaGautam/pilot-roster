// src/DashboardPage.tsx
import React from 'react';

import dashboardStyles from '../../styles/dashboard.module.css';

const DashboardPage = () => {
	return (
		<div className={dashboardStyles.container}>
		{/* SIDEBAR */}
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
				<span className={dashboardStyles.navIcon}>✈️</span> Flights
				</li>
				<li className={dashboardStyles.navItem}>
				<span className={dashboardStyles.navIcon}>⛅</span> Weather
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
			<div className={dashboardStyles.bugReport}>🐞 Report Bug</div>
			<div className={dashboardStyles.userBadge}>
				<span className={dashboardStyles.userInitials}>PG</span>
				<span style={{ marginLeft: 8 }}>Pranisha Gautam</span>
			</div>
			</div>
		</aside>

		{/* MAIN CONTENT AREA */}
		<main className={dashboardStyles.mainContent}>
			{/* TOP BAR */}
			<div className={dashboardStyles.topBar}>
			<h1 className={dashboardStyles.pageTitle}>Himalaya Airlines</h1>
			<div className={dashboardStyles.topUserInfo}>
				<span className={dashboardStyles.userCircle}>PG</span>
				<span style={{ marginLeft: 8 }}>Pranisha Gautam</span>
			</div>
			</div>

			{/* ACTIVITY SECTION */}
			<section className={dashboardStyles.activitySection}>
			<h2 className={dashboardStyles.sectionTitle}>Activity</h2>
			<div className={dashboardStyles.activityCards}>
				{/* Passengers Card */}
				<div className={dashboardStyles.activityCard}>
				<h3 className={dashboardStyles.activityCardTitle}>Passengers</h3>
				<p className={dashboardStyles.activityCardValue}>
					4,823 <span className={dashboardStyles.upIndicator}>↑ 16.9%</span>
				</p>
				<p className={dashboardStyles.activityCardDate}>From Jun 23, 2025</p>
				</div>
				{/* Flights Card */}
				<div className={dashboardStyles.activityCard}>
				<h3 className={dashboardStyles.activityCardTitle}>Flights</h3>
				<p className={dashboardStyles.activityCardValue}>
					17 <span className={dashboardStyles.downIndicator}>↓ 12%</span>
				</p>
				<p className={dashboardStyles.activityCardDate}>From Jun 23, 2025</p>
				</div>
				{/* Waiting List Card */}
				<div className={dashboardStyles.activityCard}>
				<h3 className={dashboardStyles.activityCardTitle}>Waiting list</h3>
				<p className={dashboardStyles.activityCardValue}>
					400 <span className={dashboardStyles.upIndicator}>↑ 4%</span>
				</p>
				<p className={dashboardStyles.activityCardDate}>From Jun 23, 2025</p>
				</div>
				{/* Delays Card */}
				<div className={dashboardStyles.activityCard}>
				<h3 className={dashboardStyles.activityCardTitle}>Delays</h3>
				<p className={dashboardStyles.activityCardValue}>
					14 <span className={dashboardStyles.upIndicator}>↑ 5%</span>
				</p>
				<p className={dashboardStyles.activityCardDate}>From Jun 23, 2025</p>
				</div>
			</div>
			</section>

			{/* FLIGHT CREW AVAILABILITY */}
			<section className={dashboardStyles.crewSection}>
			<h2 className={dashboardStyles.sectionTitle}>Flight Crew Availability</h2>
			<div className={dashboardStyles.filterRow}>
				<label>Hours From</label>
				<select className={dashboardStyles.selectBox}>
				<option>0</option>
				<option>1000</option>
				<option>2000</option>
				</select>
				<label>Hours To</label>
				<select className={dashboardStyles.selectBox}>
				<option>9999</option>
				<option>3000</option>
				<option>4000</option>
				</select>
			</div>
			<table className={dashboardStyles.crewTable}>
				<thead>
				<tr>
					<th>Pilot</th>
					<th>Hours Flown</th>
					<th>Role</th>
				</tr>
				</thead>
				<tbody>
				<tr>
					<td>Abhishek Bhandari</td>
					<td>3200 hrs</td>
					<td>Captain</td>
				</tr>
				<tr>
					<td>Prativa Shrestha</td>
					<td>2500 hrs</td>
					<td>First Officer</td>
				</tr>
				<tr>
					<td>Shaurya Srivastava</td>
					<td>2800 hrs</td>
					<td>Second Officer</td>
				</tr>
				<tr>
					<td>Shreya Yadav</td>
					<td>1500 hrs</td>
					<td>First Officer</td>
				</tr>
				<tr>
					<td>Anju Tamang</td>
					<td>900 hrs</td>
					<td>Second Officer</td>
				</tr>
				</tbody>
			</table>
			</section>

			{/* FLIGHT CARD + TEAM SECTION */}
			<section className={dashboardStyles.flightTeamSection}>
			{/* Flight Card */}
			<div className={dashboardStyles.flightCard}>
				<div className={dashboardStyles.flightCardHeader}>
				<h3>Flight 793-23</h3>
				<span className={dashboardStyles.nowBoarding}>Now Boarding</span>
				</div>
				<p>KTM → BIR</p>
				<p>Gate assigned: Mayask Shrestha</p>
				<button className={dashboardStyles.assignPilotBtn}>Assign a Pilot</button>
			</div>

			{/* Team Section */}
			<div className={dashboardStyles.teamSection}>
				<h2 className={dashboardStyles.sectionTitle}>Himalaya Airlines Team</h2>
				<div className={dashboardStyles.teamList}>
				<div className={dashboardStyles.teamMember}>
					<img
					src="https://i.pravatar.cc/40?img=1"
					alt="Profile"
					className={dashboardStyles.profilePic}
					/>
					<div className={dashboardStyles.teamInfo}>
					<strong>Saija Rabindari</strong>
					<span className={dashboardStyles.teamStatusOnline}>Online</span>
					</div>
				</div>
				<div className={dashboardStyles.teamMember}>
					<img
					src="https://i.pravatar.cc/40?img=2"
					alt="Profile"
					className={dashboardStyles.profilePic}
					/>
					<div className={dashboardStyles.teamInfo}>
					<strong>Sijita Tamang</strong>
					<span className={dashboardStyles.teamStatusOffline}>Offline</span>
					</div>
				</div>
				{/* You can add more team members here */}
				</div>
			</div>
			</section>
		</main>
		</div>
	);
};

export default DashboardPage;