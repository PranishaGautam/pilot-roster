import Badge from '@mui/material/Badge';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DisplayCard from '../DisplayCard';
import FlightDistributionChart from '../FlightDistributionChart';

import Spinner from '../Spinner';

import commonStyles from '../../../styles/common.module.css';
import dashboardStyles from '../../../styles/dashboard.module.css';

import { UpdatePilotRequestPayload } from '../../models/requests-interface';
import { PilotRequests, PilotResponse } from '../../models/response-interface';
import { ScheduleTableData } from '../../models/schedule-interface';

import { Box, Modal } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBackendActions } from '../../hooks/callBackend';
import isLoading from '../../hooks/isLoading';
import { useToast } from '../../hooks/useToast';
import { MAX_PILOT_FLYING_HOURS } from '../../utils/constants';
import PerformanceBar from '../PerformanceBar';

interface Props {
    scheduleDataProp: Array<ScheduleTableData>;
    pilotListProp: Array<PilotResponse>;
    pilotPerformanceData: {pilotId: string, flyingHours: number}[];
}

const Dashboard = ({ scheduleDataProp, pilotListProp, pilotPerformanceData }: Props) => {

    const { token, userId } = useAuth();
    const { getAllLeaveRequests, updateLeaveRequest } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);

    const scheduledFlights = useMemo(() => {
        const scheduledFlights = scheduleDataProp.filter((flight) => flight.status?.toLowerCase() === 'scheduled').length;
        return (
            <DisplayCard
                cardTitle={'Scheduled Flights'}
                cardValue={scheduledFlights}
                cardDate={moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')}
            />
        );
    }, [scheduleDataProp]);

    const flightHours = useMemo(() => {
        const totalFlightHours = pilotPerformanceData.reduce((acc, pilot) => acc + pilot.flyingHours, 0);
        return (
            <DisplayCard
                cardTitle={'Total Flight Hours'}
                cardValue={totalFlightHours}
                cardDate={moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')}
            />
        )
    }, [pilotPerformanceData]);

    const pilotCrewPerformance = useMemo(() => {
        const totalFlightHours = pilotPerformanceData.reduce((acc, pilot) => acc + pilot.flyingHours, 0);

        const totalPilots = pilotPerformanceData.length;
        const totalPilotMaxHours = totalPilots * MAX_PILOT_FLYING_HOURS;

        const crewPerformance = (totalFlightHours / totalPilotMaxHours) * 100;

        return (
            <DisplayCard
                cardTitle={'Pilot Crew Performance'}
                cardValue={`${crewPerformance.toFixed(2)}%`}
                content={
                    <>
                        <div className={dashboardStyles.progressBarContainer}>
                            <PerformanceBar value={crewPerformance} />
                            <span className={dashboardStyles.activityCardDate}>{moment().format('MMMM, YYYY')}</span>
                        </div>
                        <Button size={'small'} variant='text' onClick={() => setIsPerformanceModalOpen(true)}>{'View Details'}</Button>
                    </>
                }
            />
        );   
    }, [pilotPerformanceData]);

    const [requests, setRequests] = useState<Array<PilotRequests>>([]);

    const inFlightPilots = useMemo(() => {
        const today = moment().format('YYYY-MM-DD HH:mm:ss');

        const inFlightSchedules = scheduleDataProp.filter(flight => {
            const startTime = moment(flight.departureTime);
            const endTime = moment(flight.arrivalTime);
            return moment(today).isBetween(startTime, endTime, 'hour', '[]');
        });

        const uniquePilotIds = Array.from(
            new Set(
                inFlightSchedules.flatMap(schedule => [
                    schedule.pilot?.pilot_id,
                    schedule.coPilot?.pilot_id
                ]).filter(pilotId => pilotId !== null && pilotId !== undefined)
            )
        );
        return uniquePilotIds;
    }, [scheduleDataProp]);

    const onLeavePilots = useMemo(() => {
        const acceptedRequests = requests.filter(request => request.status?.toLowerCase() === 'approved');
        const today = moment().format('YYYY-MM-DD HH:mm:ss');

        const todayLeave = acceptedRequests.filter(request => {
            const startTime = moment(request.start_time);
            const endTime = moment(request.end_time);
            return moment(today).isBetween(startTime, endTime, 'day', '[]');
        });

        const onleavePilotRequests = todayLeave.map(request => {
            const pilot = pilotListProp.find(pilot => pilot.pilot_id === request.requestor_id);
            return pilot ? { ...pilot, status: 'time off' } : null;
        });

        const uniquePilotIds = Array.from(new Set(onleavePilotRequests.map(pilot => pilot?.pilot_id)));
        return uniquePilotIds;

    }, [requests]);

    const availablePilots = useMemo(() => {
        const totalPilots = pilotListProp.length;
        const unavailablePilotsCount = inFlightPilots.length + onLeavePilots.length;
        const availablePilotsCount = totalPilots - unavailablePilotsCount;

        return pilotListProp
            .filter(pilot => !inFlightPilots.includes(pilot.pilot_id) && !onLeavePilots.includes(pilot.pilot_id))
            .map(pilot => ({ ...pilot, status: 'available' }));
    }, [pilotListProp, inFlightPilots, onLeavePilots]);

    const activePilots = useMemo(() => {
        const totalActivePilots = availablePilots?.length ?? 0 + inFlightPilots.length + onLeavePilots.length;
        return (
            <DisplayCard
                cardTitle={'Available Pilots'}
                cardValue={totalActivePilots}
                cardDate={moment().startOf('month').format('YYYY-MM-DD HH:mm:ss')}
            />
        )
    }, [pilotListProp, availablePilots]);

    const pendingRequests = useMemo(() => {
        return requests.filter(request => request.status?.toLowerCase() === 'pending');
    },[requests]);

    const getAllRequests = () => {
        if (token) {
            getAllLeaveRequests('leave-requests', token)
                .then((data) => {
                    // successToast('Leave requests fetched successfully!');
                    // console.log('Fetched leave requests:', data);
                    setRequests(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // console.log('No token found!');
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
        getAllRequests();
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
                    {activePilots}
                    {scheduledFlights}
                    {flightHours}
                    {pilotCrewPerformance}
                </div>
            </section>

            <section className={dashboardStyles.overviewMidDiv}>
                <FlightDistributionChart/>

                <div className={dashboardStyles.pilotAvailabilityDiv}>
                    <div className={dashboardStyles.contentDiv}>
                        <div className={dashboardStyles.titleDiv}>
                            <h2 className={dashboardStyles.sectionTitle}>Pilot Availability ({moment().format('MMMM Do, YYYY')})</h2>
                        </div>
                        
                        <div className={dashboardStyles.pilotStatsDiv}>
                            <div className={dashboardStyles.pilotStat}>
                                <div className={dashboardStyles.labelDiv}>
                                    <Badge 
                                        badgeContent={" "} 
                                        color={'success'}
                                    />
                                    <p>{'Available'}</p>
                                </div>
                                <span className={dashboardStyles.statCount}>{availablePilots?.length ?? 0}</span>
                            </div>
                            <div className={dashboardStyles.pilotStat}>
                                <div className={dashboardStyles.labelDiv}>
                                    <Badge 
                                        badgeContent={" "} 
                                        color={'secondary'}
                                    />
                                    <p>{'In Flight'}</p>
                                </div>
                                <span className={dashboardStyles.statCount}>{inFlightPilots?.length ?? 0}</span>
                            </div>
                            <div className={dashboardStyles.pilotStat}>
                                <div className={dashboardStyles.labelDiv}>
                                    <Badge 
                                        badgeContent={" "} 
                                        color={'error'}
                                    />
                                    <p>{'On Leave'}</p>
                                </div>
                                <span className={dashboardStyles.statCount}>{onLeavePilots?.length ?? 0}</span>
                            </div>
                        </div>
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

            <Modal open={isPerformanceModalOpen} onClose={() => setIsPerformanceModalOpen(false)} className={dashboardStyles.modal}>
                <Box 
                    className={commonStyles.adminPilotPerformanceModal}
                    sx={{  bgcolor: 'background.paper' }}
                >
                    <div style={{ width: '100%' }}>
                        <div style={{ maxHeight: '600px', overflowY: 'auto', width: '100%' }}>
                            {pilotListProp.map((pilot, index) => {
                                const flyingHours = pilotPerformanceData.find(p => p.pilotId === pilot.pilot_id.toLocaleString())?.flyingHours || 0;
                                const performancePercentage = (flyingHours / MAX_PILOT_FLYING_HOURS) * 100;

                                return (
                                    <div
                                        key={pilot.pilot_id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '10px',
                                            borderBottom: '1px solid #ddd',
                                            borderRadius: '5px',
                                            backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography
                                                variant="body1"
                                                style={{
                                                    marginRight: '15px',
                                                    fontWeight: 'bold',
                                                    color: '#333',
                                                }}
                                            >
                                                {index + 1}.
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                style={{
                                                    marginRight: '15px',
                                                    fontWeight: '500',
                                                    color: '#555',
                                                }}
                                            >
                                                {`${_.capitalize(pilot.first_name)} ${_.capitalize(pilot.last_name)}`}
                                            </Typography>
                                        </div>
                                        <div style={{ flex: 1, marginLeft: '15px' }}>
                                            <PerformanceBar value={performancePercentage} />
                                        </div>
                                        <Typography
                                            variant="body2"
                                            style={{
                                                marginLeft: '15px',
                                                fontWeight: '500',
                                                color: performancePercentage > 75 ? '#4caf50' : performancePercentage > 50 ? '#ff9800' : '#f44336',
                                            }}
                                        >
                                            {`${flyingHours} hrs`}
                                        </Typography>
                                    </div>
                                );
                            })}
                        </div>
                        <Button variant='contained' onClick={() => setIsPerformanceModalOpen(false)}>{'Close'}</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default Dashboard;