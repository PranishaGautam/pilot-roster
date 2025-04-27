import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { CircularProgress } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

import dashboardStyles from './../../styles/dashboard.module.css';

import { useAuth } from '../context/AuthContext';
import { useBackendActions } from './../hooks/callBackend';
import isLoading from './../hooks/isLoading';
import { useToast } from './../hooks/useToast';
import { FlightDetails } from './../models/response-interface';
import { ScheduleTableData } from './../models/schedule-interface';

const FlightDistributionChart = () => {

	const { token, userId, pilotId, role } = useAuth();
	const { getFlightDetails, getFlightDetailsByPilotId } = useBackendActions();
	const { successToast, errorToast } = useToast();

	const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);
		
	const getFlightDetailsData = async () => {
		if (token) {
			if (role === 'admin') {
				// Call the backend API with the selected parameters
				getFlightDetails('schedules-area', token)
				.then((response) => {
					if (response.length === 0) {
						setScheduleData([]);
					} else {
						const formattedSchedules: ScheduleTableData[] = response.map((schedule: FlightDetails) => {

							const assignedPilot = schedule?.pilots?.pilot ?? null;
							const assignedCoPilot = schedule?.pilots?.co_pilot ?? null;

							return {
								scheduleId: schedule.schedule.schedule_id,
								flightNumber: schedule.schedule.flight_number,
								origin: schedule.schedule.origin,
								destination: schedule.schedule.destination,
								departureTime: moment(schedule.schedule.start_time).format('YYYY-MM-DD HH:mm:ss'),
								arrivalTime: moment(schedule.schedule.end_time).format('YYYY-MM-DD HH:mm:ss'),
								status: schedule.schedule.status,
								pilot: assignedPilot ?? null,
								coPilot: assignedCoPilot ?? null
							}
						});
						setScheduleData(formattedSchedules);
					}
				})
				.catch((error) => {
					console.error('Error fetching flight details:', error);
					setScheduleData([]);
				});
			} else if (role === 'pilot') {
				if (!pilotId) {
					errorToast('Pilot ID is missing. Please log in again.');
					return;
				}
				// Call the backend API with the selected parameters
				getFlightDetailsByPilotId('schedules-area', token, pilotId)
				.then((response) => {
					if (response.length === 0) {
						errorToast('No schedules found for the pilot');
						setScheduleData([]);
					} else {
						const formattedSchedules: ScheduleTableData[] = response.map((schedule: FlightDetails) => {

							const assignedPilot = schedule?.pilots?.pilot ?? null;
							const assignedCoPilot = schedule?.pilots?.co_pilot ?? null;

							return {
								scheduleId: schedule.schedule.schedule_id,
								flightNumber: schedule.schedule.flight_number,
								origin: schedule.schedule.origin,
								destination: schedule.schedule.destination,
								departureTime: moment(schedule.schedule.start_time).format('YYYY-MM-DD HH:mm:ss'),
								arrivalTime: moment(schedule.schedule.end_time).format('YYYY-MM-DD HH:mm:ss'),
								status: schedule.schedule.status,
								pilot: assignedPilot ?? null,
								coPilot: assignedCoPilot ?? null
							}
						});
						setScheduleData(formattedSchedules);
					}
				})
				.catch((error) => {
					// console.error('Error fetching flight details:', error);
					// errorToast('Error fetching flight details. Please try again.');
					setScheduleData([]);
				});
			}
		} else {
			errorToast('Authentication token is missing. Please log in again.');
		}
	}

	const last7Days = [...Array(7)].map((_, i) => 
		moment().subtract(i, 'days').toDate()
	).reverse();

	const aggregatedFlightHours: Array<number> = useMemo(() => {
		const dailyFlightHours: Record<string, number> = {};

		// Loop through scheduleData to compute daily flight hours.
		scheduleData.filter(schedule => schedule.status === 'COMPLETED').forEach((schedule) => {
			// Convert departureTime & arrivalTime to Moment for calculations.
			const departure = moment(schedule.departureTime, 'YYYY-MM-DD HH:mm:ss');
			const arrival = moment(schedule.arrivalTime, 'YYYY-MM-DD HH:mm:ss');

			// Check if the flight falls within the last 7 days.
			const isWithinLast7Days = last7Days.some(day => {
			const dayStart = moment(day).startOf('day');
			const dayEnd = moment(day).endOf('day');
			return departure.isBetween(dayStart, dayEnd, null, '[]') || arrival.isBetween(dayStart, dayEnd, null, '[]');
			});

			if (isWithinLast7Days) {
				// Calculate flight duration in hours.
				const flightDurationHours = arrival.diff(departure, 'hours');

				// Format departure date as YYYY-MM-DD to group by day.
				const dayKey = departure.format('YYYY-MM-DD');

				// Add up the total flight hours.
				if (!dailyFlightHours[dayKey]) {
					dailyFlightHours[dayKey] = 0;
				}
				dailyFlightHours[dayKey] += flightDurationHours;
			}
		});

		// 3. Build the array of flight hours for each of the last 7 days.
		const flightHoursData = last7Days.map(day => dailyFlightHours[moment(day).format('YYYY-MM-DD')] || 0);
		return flightHoursData;
	}, [scheduleData]);

	useEffect(() => {
		getFlightDetailsData();
	}, []);

	const isLoadingData = isLoading('schedules-area');

	return (
		<div className={dashboardStyles.chartDiv}>
			<h2 className={dashboardStyles.sectionTitle}>Flight Hours Distribution</h2>
			<div className={dashboardStyles.dsitributionChart}>
				{
					isLoadingData ? (
						<div className={dashboardStyles.loadingSpinner}>
							<CircularProgress color={'primary'} />
						</div>
					) : (
						<LineChart
							title={'Flight Hours Distribution (Last 7 days)'}
							xAxis={[
								{
									id: 'date',
									label: 'Day of the Week (Past 7 days)', 
									scaleType: 'point',
									data: last7Days,
									valueFormatter: (date) => `${moment(date).format('dddd')}` // Format to get day of the week
								}
							]}
							yAxis={[
								{
									id: 'flightHours',
									label: 'Total Flight Hours',
									scaleType: 'linear',
								}
							]}
							series={[
								{
									data: aggregatedFlightHours,
									area: true,
								},
							]}
							height={250}
							width={600}
						/>
					)
				}
				
			</div>
		</div>
	)
}

export default FlightDistributionChart