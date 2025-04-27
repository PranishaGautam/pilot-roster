import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Modal } from '@mui/material';

import DisplayCard from '../DisplayCard';
import FlightDistributionChart from '../FlightDistributionChart';
import PerformanceBar from '../PerformanceBar';
import SchedulesTable from '../SchedulesTable';
import Spinner from '../Spinner';

import dashboardStyles from '../../../styles/dashboard.module.css';

import { FlightDetails } from '../../models/response-interface';
import { ScheduleTableData } from '../../models/schedule-interface';

import { useAuth } from '../../context/AuthContext';
import { useBackendActions } from '../../hooks/callBackend';
import isLoading from '../../hooks/isLoading';

import { useToast } from '../../hooks/useToast';
import { MAX_PILOT_FLYING_HOURS } from '../../utils/constants';

const PilotDashboard = () => {

    const { token, pilotId } = useAuth();
    const { getFlightDetailsByPilotId } = useBackendActions();
    const { errorToast } = useToast();

    const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

    const nextSchedule: ScheduleTableData | null = useMemo(() => {
        return scheduleData.reduce<ScheduleTableData | null>((closest, current) => {
            const currentTime = moment();
            const currentStartTime = moment(current.departureTime);
            const closestStartTime = closest ? moment(closest.departureTime) : null;

            if (
                currentStartTime.isAfter(currentTime) &&
                (!closestStartTime || currentStartTime.isBefore(closestStartTime))
            ) {
                return current;
            }

            return closest;
        }, null);
    }, [scheduleData]);

    const [isActivityModal, setIsActivityModal] = useState(false);

    const getPilotSchedules = (pilotId: string) => {

        if (!token) {
            errorToast('Token is missing. Please log in again.');
            return;
        }

        // Call the backend API with the selected parameters
        getFlightDetailsByPilotId('pilot-schedules-area', token, pilotId)
        .then((response) => {
            if (response.length === 0) {
                // errorToast('No schedules found for the pilot');
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

    const nextScheduleCard = useMemo(() => {
        if (!nextSchedule) {
            return {
                title: 'Next Duty',
                value: 'No upcoming flights assigned'
            }
        }
        return {
            title: 'Next Duty',
            value: moment(nextSchedule.departureTime).format('YYYY-MM-DD HH:mm A').toString()
        };
    }, [nextSchedule]);

    const monthlyFlightHours = useMemo(() => {
        const currentMonth = moment().month();
        const monthlyHours = scheduleData.filter(schedule => {return schedule.status === 'COMPLETED'}).reduce((total, schedule) => {
            const scheduleMonth = moment(schedule.departureTime).month();
            if (scheduleMonth === currentMonth) {
                return total + (moment(schedule.arrivalTime).diff(moment(schedule.departureTime), 'hours'));
            }
            return total;
        }, 0);
        return monthlyHours;
    }, [scheduleData]);

    const performance = useMemo(() => {
        const performancePercentage = (monthlyFlightHours / MAX_PILOT_FLYING_HOURS) * 100
        return {
            title: 'Performance',
            value: `${performancePercentage.toPrecision(2)}%`,
            content: (
                <div className={dashboardStyles.progressBarContainer}>
                    <PerformanceBar value={performancePercentage} />
                    <span className={dashboardStyles.progressBarText}>{moment().format('MMMM, YYYY')}</span>
                </div>
            )
        };
    }, [monthlyFlightHours]);

    const totalFlightHours = useMemo(() => {
        return {
            title: 'Total Flight Hours',
            value: `${monthlyFlightHours} hours`,
            date: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        };
    }, [monthlyFlightHours]);
    
    useEffect(() => {
        if (!pilotId) return;
        getPilotSchedules(pilotId);
    }, []);

    const isLoadingData = isLoading('pilot-schedules-area');

    return (
        <>
            {
                isLoadingData && 
                    <Spinner
                        color='primary'
                        size={60}
                    />
            }

            {/* ACTIVITY SECTION */}
            <section className={dashboardStyles.activitySection}>
                <h2 className={dashboardStyles.sectionTitle}>Activity</h2>
                <div className={dashboardStyles.activityCards}>
                    <DisplayCard 
                        cardTitle={nextScheduleCard.title} 
                        cardValue={nextScheduleCard.value}
                        content={
                            nextSchedule && (
                                <Button size='small' variant='text' onClick={() => setIsActivityModal(true)}>{'View Details'}</Button>
                            )
                        }
                    />
                    <DisplayCard 
                        cardTitle={totalFlightHours.title} 
                        cardValue={totalFlightHours.value} 
                        cardDate={totalFlightHours.date}
                    />
                    <DisplayCard 
                        cardTitle={performance.title} 
                        cardValue={performance.value}
                        content={performance.content}
                    />
                </div>
            </section>

            <section className={dashboardStyles.flightDistributionDiv}>
                <FlightDistributionChart/>
            </section>

            <section>
                <h2 className={dashboardStyles.sectionTitle}>Upcoming Flight Schedules</h2>
                <SchedulesTable />
            </section>

            <Modal open={isActivityModal} onClose={() => setIsActivityModal(false)} className={dashboardStyles.modal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'fit-content',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        {nextSchedule ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px' }}>
                                <h3 style={{ marginBottom: '15px', fontSize: '1.5rem', fontWeight: 'bold' }}>{'Flight Details'}</h3>
                                <p><strong>{'Flight Number:'}</strong> {nextSchedule.flightNumber}</p>
                                <p><strong>{'Origin:'}</strong> {nextSchedule.origin}</p>
                                <p><strong>{'Destination:'}</strong> {nextSchedule.destination}</p>
                                <p><strong>{'Departure Time:'}</strong> {moment(nextSchedule.departureTime).format('YYYY-MM-DD HH:mm A')}</p>
                                <p><strong>{'Arrival Time:'}</strong> {moment(nextSchedule.arrivalTime).format('YYYY-MM-DD HH:mm A')}</p>
                                <p><strong>{'Status:'}</strong> {nextSchedule.status}</p>
                                <p><strong>{'Pilot:'}</strong> {nextSchedule?.pilot?.first_name || 'Not Assigned'}</p>
                                <p><strong>{'Co-Pilot:'}</strong> {nextSchedule?.coPilot?.first_name || 'Not Assigned'}</p>
                            </div>
                        ) : (
                            <p>{'No flight details available.'}</p>
                        )}
                        <Button variant='contained' onClick={() => setIsActivityModal(false)}>{'Close'}</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default PilotDashboard;