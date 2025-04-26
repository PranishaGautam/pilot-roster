import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import TopNavBar from '../components/TopNavBar';
import Dashboard from '../components/AdminComponents/Dashboard';
import Schedule from '../components/AdminComponents/Schedule';
import CrewManagement from '../components/AdminComponents/CrewManagement';
import FlightHistory from '../components/AdminComponents/FlightHistory';
import Sidebar from '../components/AdminComponents/SideBar';
import Notifications from '../components/PilotComponents/Notifications';

import dashboardStyles from '../../styles/dashboard.module.css';
import { ScheduleTableData } from '../models/schedule-interface';
import { FlightDetails, PilotResponse } from '../models/response-interface';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { useBackendActions } from '../hooks/callBackend';

const Admin = () => {

	const { token, userId, role, pilotId } = useAuth();
	const { getFlightDetails, getAllPilots } = useBackendActions();
	 const { errorToast } = useToast();

	const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

	const getFlightSchedules = () => {
		if (token) {
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
				errorToast('Error fetching flight details. Please try again.');
				setScheduleData([]);
			});
		}
	}

	const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);

	const getPilots = () => {
        if (token) {
            getAllPilots('pilot-area', token)
                .then((data) => {
                    console.log('Fetched pilots:', data);
                    setPilotList(data);
                })
                .catch((error) => {
                    console.log(error);
                    errorToast('Failed to fetch pilots!');
                });
        } else {
            errorToast('Authentication token is missing. Please log in again.');
        }
    };

	const pilotPerformances = useMemo(() => {
		const performanceData: { [key: string]: number } = {};

		const currentMonth = moment().month();
		const currentYear = moment().year();

		scheduleData.forEach((schedule) => {
			if (schedule.status === 'COMPLETED') {
				const scheduleMonth = moment(schedule.departureTime).month();
				const scheduleYear = moment(schedule.departureTime).year();

				if (scheduleMonth === currentMonth && scheduleYear === currentYear) {
					const pilotId = schedule.pilot?.pilot_id;
					const coPilotId = schedule.coPilot?.pilot_id;

					const flightDuration = moment(schedule.arrivalTime).diff(moment(schedule.departureTime), 'hours');

					if (pilotId) {
						if (!performanceData[pilotId]) {
							performanceData[pilotId] = 0;
						}
						performanceData[pilotId] += flightDuration;
					}

					if (coPilotId) {
						if (!performanceData[coPilotId]) {
							performanceData[coPilotId] = 0;
						}
						performanceData[coPilotId] += flightDuration;
					}
				}
			}
		});

		return Object.entries(performanceData).map(([pilotId, flyingHours]) => ({
			pilotId,
			flyingHours,
		}));
	}, [pilotList, scheduleData]);

	useEffect(() => {
		getFlightSchedules();
		getPilots();
	}, []);

	const [activePage, setActivePage] = useState('dashboard');

	const renderPage = () => {
		switch (activePage) {
			case 'dashboard': 
				return (
					<Dashboard 
						scheduleDataProp={scheduleData} 
						pilotListProp={pilotList} 
						pilotPerformanceData={pilotPerformances} 
					/>
				);
			case 'schedule': 
				return <Schedule />;
			case 'crew': 
				return <CrewManagement />;
			case 'history': 
				return <FlightHistory />;
			case 'notifications':
				return <Notifications />;
			default: 
				return (
					<Dashboard 
						scheduleDataProp={scheduleData} 
						pilotListProp={pilotList} 
						pilotPerformanceData={pilotPerformances} 
					/>
				);
		}
	};

	return (
		<div className={dashboardStyles.container}>
			<Sidebar onSelect={setActivePage} activePage={activePage}/>
			<div className={dashboardStyles.mainContent}>
				<TopNavBar/>
				{renderPage()}
			</div>
		</div>
	);
};

export default Admin;