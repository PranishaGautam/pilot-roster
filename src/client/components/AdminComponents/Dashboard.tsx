import { useEffect, useMemo, useState } from 'react'
import Badge from '@mui/material/Badge';
import moment from 'moment';
import _ from 'lodash';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';

import { LineChart } from '@mui/x-charts/LineChart';

import Spinner from '../Spinner';

import dashboardStyles from '../../../styles/dashboard.module.css';
import DisplayCard from '../DisplayCard';
import { useAuth } from '../../context/AuthContext';
import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { PilotResponse, PilotRequests, FlightDetails } from '../../models/response-interface';
import { useToast } from '../../hooks/useToast';
import { UpdatePilotRequestPayload, UpdateRequestPayload } from '../../models/requests-interface';
import { ScheduleTableData } from '../../models/schedule-interface';
import FlightDistributionChart from '../FlightDistributionChart';

const Dashboard = () => {
    
    const cardDisplayContents = [
		{
			title: 'Active Pilots',
			value: 223,
			percentageIndicator: 'positive',
			percentageChange: '12',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'Scheduled Flights',
			value: 1387,
			percentageIndicator: 'positive',
			percentageChange: '12',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'Flight Hours',
			value: 14578,
			percentageIndicator: 'negative',
			percentageChange: '4',
			date: '2025-04-01 10:00:00',
		},
		{
			title: 'On-Time Rate',
			value: 14,
			percentageIndicator: 'positive',
			percentageChange: '2',
			date: '2025-04-01 10:00:00',
		},
	]

    const { token, userId } = useAuth();

    const { getAllPilots, getAllLeaveRequests, updateLeaveRequest, getFlightDetails } = useBackendActions();

    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);
    const [requests, setRequests] = useState<Array<PilotRequests>>([]);

    const pilotStats = useMemo(() => {
        return pilotList.reduce((acc, pilot) => {
            const status = pilot.status.toLowerCase();
            if (!acc[status]) {
            acc[status] = 0;
            }
            acc[status]++;
            return acc;
        }, {} as Record<string, number>);
    }, [pilotList]);

    const pendingRequests = useMemo(() => {
        return requests.filter(request => request.status.toLowerCase() === 'pending');
    },[requests]);

    const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);
    
    const getFlightDetailsData = async () => {
        if (token) {
            // Call the backend API with the selected parameters
            getFlightDetails('schedules-area', token)
            .then((response) => {
                if (response.length === 0) {
                    errorToast('No schedules found for the selected criteria.');
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
        scheduleData.forEach((schedule) => {
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

    const getPilots = () => {
        if (token) {
            getAllPilots('pilot-area', token)
                .then((data) => {
                    // successToast('Pilots fetched successfully!');
                    console.log('Fetched pilots:', data);
                    setPilotList(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('No token found!');
        }
    };

    const getAllRequests = () => {
        if (token) {
            getAllLeaveRequests('leave-requests', token)
                .then((data) => {
                    // successToast('Leave requests fetched successfully!');
                    console.log('Fetched leave requests:', data);
                    setRequests(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('No token found!');
        }
    }

    const handleRequestAction = (requestId: number, action: 'APPROVED' | 'REJECTED') => {
        if (token) {
            // Call the API to approve/reject the request
            // Update the state accordingly
            const payload: UpdatePilotRequestPayload = {
                approver_id: Number(userId),
                status: action,
                approval_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            }

            updateLeaveRequest('update-leave-request', token, requestId, payload)
            .then((data) => {
                successToast('Leave request updated successfully!');
                getAllRequests();
            })
            .catch((error) => {
                console.log(error);
                errorToast('Failed to update leave request!');
            });
        } else {
            console.log('No token found!');
            errorToast('No token found!');
        }
    }

    useEffect(() => {
        getPilots();
        getAllRequests();
        getFlightDetailsData();
    }, []);

    const updatingLeaveRequest = isLoading('update-leave-request');

    return (
        <>
            {
                updatingLeaveRequest && 
                    <Spinner
                        color='primary'
                        size={60}
                    />
            }

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

            <section className={dashboardStyles.overviewMidDiv}>
                <FlightDistributionChart/>
                {/* <div className={dashboardStyles.chartDiv}>
                    <h2 className={dashboardStyles.sectionTitle}>Flight Hours Distribution</h2>
                    <div className={dashboardStyles.dsitributionChart}>
                        <LineChart
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
                    </div>
                </div> */}

                <div className={dashboardStyles.pilotAvailabilityDiv}>
                    <h2 className={dashboardStyles.sectionTitle}>Pilot Availability</h2>
                    <div className={dashboardStyles.pilotStatsDiv}>
                        {Object.entries(pilotStats).map(([status, count]) => (
                            <div key={status} className={dashboardStyles.pilotStat}>
                                <div className={dashboardStyles.labelDiv}>
                                    <Badge 
                                        badgeContent={" "} 
                                        color={
                                            status === 'available' ? 'success' :
                                            status === 'time off' ? 'error' :
                                            status === 'in flight' ? 'secondary' :
                                            status === 'stand by' ? 'info' : 'default'
                                        }
                                    />
                                    <p>{status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                                </div>
                                <span className={dashboardStyles.statCount}>{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={dashboardStyles.recentActivitiesDiv}>
                <h2 className={dashboardStyles.sectionTitle}>Recent Requests</h2>
                <div className={dashboardStyles.activityDiv}>
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((request, index) => (
                            <Accordion key={index} defaultExpanded={false}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    <div className={dashboardStyles.requestSummary}>
                                        <Typography component="span">{`${_.capitalize(request.first_name)} ${_.capitalize(request.last_name)}`}</Typography>
                                        <Typography component="span" style={{ fontSize: '14px', color: '#555' }}>
                                            <strong>Request Type:</strong> {request.request_type}
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails className={dashboardStyles.requestDetails}>
                                    <Typography component="span" style={{ fontSize: '14px', color: '#555' }}>
                                        <strong>Reason:</strong> {request.request_description}
                                    </Typography>
                                    <Typography component="span" style={{ fontSize: '14px', color: '#555' }}>
                                        <strong>From:</strong> {moment(request.start_time).format('YYYY-MM-DD')}
                                    </Typography>
                                    <Typography component="span" style={{ fontSize: '14px', color: '#555' }}>
                                        <strong>To:</strong> {moment(request.end_time).format('YYYY-MM-DD')}
                                    </Typography>
                                </AccordionDetails>
                                <AccordionActions>
                                    <Button variant={'outlined'} color={'error'} onClick={() => handleRequestAction(request.request_id, 'REJECTED')}>Reject</Button>
                                    <Button variant={'contained'} onClick={() => handleRequestAction(request.request_id, 'APPROVED')}>Approve</Button>
                                </AccordionActions>
                            </Accordion>
                        ))
                    ) : (
                        <p style={{ fontSize: '14px', color: '#888' }}>No pending requests at the moment.</p>
                    )}
                </div>
            </section>
        </>
    )
}

export default Dashboard;