import moment from 'moment';
import { useEffect, useState } from 'react';

import {
    Button
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

import Divider from '@mui/material/Divider';

import '@fontsource/roboto/300.css';

import Spinner from '../Spinner';

import flightHistoryStyles from '../../../styles/flightHistory.module.css';

import { useAuth } from '../../context/AuthContext';
import { useBackendActions } from '../../hooks/callBackend';
import isLoading from '../../hooks/isLoading';
import { useToast } from '../../hooks/useToast';

import { FlightDetailQueryParams } from '../../models/requests-interface';
import { FlightDetails } from '../../models/response-interface';
import { ScheduleTableData } from '../../models/schedule-interface';


const FlightHistory = () => {

    const { token } = useAuth();

    const { getFlightDetails } = useBackendActions();
    const { errorToast } = useToast();

    const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

    const [visibleCount, setVisibleCount] = useState(10);

    // Handler to increment how many flights to show
    const loadMore = () => {
        setVisibleCount((prev) => prev + 10);
    };

    // Slice the flight records to show only the current count
    const visibleFlights = scheduleData.slice(0, visibleCount); 

    const getFlightDetailsData = async () => {

        const params: FlightDetailQueryParams = {
            end_date: `${new Date().toISOString().split('.')[0]}Z`,
        };

        if (token) {
            // Call the backend API with the selected parameters
            getFlightDetails('schedules-area', token, params)
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

    useEffect(() => {
        // Fetch flight details when the component mounts or when the token changes
        if (token) {
            getFlightDetailsData();
        }
    }, []);

    const isFetchingData = isLoading('schedules-area');

    return (
        <div>

            {
                isFetchingData && 
                    <Spinner
                        color='primary'
                        size={60}
                    />
            }
            <div className={flightHistoryStyles.flightContainer}>

                <div className={flightHistoryStyles.containerTitle}>
                    <h2 className={flightHistoryStyles.flightTitle}>Flights History</h2>
                </div>

                <Divider></Divider>

                <div className={flightHistoryStyles.flightsDiv}>

                    {
                        scheduleData.length === 0 ? (
                            <div className={flightHistoryStyles.noFlightDiv}>
                                <Typography component="p" color={'textDisabled'} fontSize={16} fontWeight={400}>
                                    {'No flight history available.'}
                                </Typography>
                            </div>
                        ) : (
                            <>
                                {
                                    visibleFlights.map((flight, index) => (
                                        <Accordion defaultExpanded={false} key={index}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls="panel3-content"
                                                id="panel3-header"
                                                className={flightHistoryStyles.flightSummary}
                                            >
                                                <div className={flightHistoryStyles.flightItem}>
                                                    <div className={flightHistoryStyles.flightInfo}>
                                                        <div className={flightHistoryStyles.flightDetailsLeft}>
                                                            <div className={flightHistoryStyles.flightIcon}>
                                                                <AirplanemodeActiveIcon className={flightHistoryStyles.flightIcon} />
                                                            </div>
                                                            <div className={flightHistoryStyles.flightRouteDetail}>
                                                                <Typography component="p" color={'textPrimary'} fontSize={16} fontWeight={500}>
                                                                    {`Flight ${flight.flightNumber}`}
                                                                </Typography>
                                                                <Typography component="p" color={'textDisabled'} fontSize={14} fontWeight={400}>
                                                                    {`${flight.origin} → ${flight.destination}`}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <div className={flightHistoryStyles.flightDetailsRight}>
                                                            <Typography component="p" color={'textPrimary'} fontSize={16} fontWeight={500}>
                                                                {moment(flight.departureTime).format('hh:mm A')}
                                                            </Typography>
                                                            <Typography component="p" color={'textDisabled'} fontSize={14} fontWeight={400}>
                                                                {moment(flight.departureTime).format('MMM DD, YYYY')}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <div className={flightHistoryStyles.flightDetails}>
                                                    <div className={flightHistoryStyles.flightDetailsOpenDiv}>
                                                        <Typography component="h4" color={'textPrimary'} fontSize={16} fontWeight={500}>
                                                            {'Flight Details'}
                                                        </Typography>

                                                        <Divider></Divider>

                                                        <div className={flightHistoryStyles.flightDetailed}>
                                                            <div className={flightHistoryStyles.flightSummary}>
                                                                <Typography component="p" color={'textPrimary'} fontSize={14} fontWeight={400}>
                                                                    {`Flight Number: ${flight.flightNumber}`}
                                                                </Typography>
                                                                <Typography component="p" color={'textPrimary'} fontSize={14} fontWeight={400}>
                                                                    {`Departure: ${moment(flight.departureTime).format('hh:mm A')}`}
                                                                </Typography>
                                                                <Typography component="p" color={'textPrimary'} fontSize={14} fontWeight={400}>
                                                                    {`Arrival: ${moment(flight.arrivalTime).format('hh:mm A')}`}
                                                                </Typography>
                                                            </div>

                                                            <div className={flightHistoryStyles.PilotDetails}>
                                                                <Typography component="p" color={'textPrimary'} fontSize={14} fontWeight={400}>
                                                                    {`Pilot: ${flight?.pilot?.first_name} ${flight?.pilot?.last_name}`}
                                                                </Typography>
                                                                <Typography component="p" color={'textPrimary'} fontSize={14} fontWeight={400}>
                                                                    {`Co-Pilot: ${flight?.coPilot?.first_name} ${flight?.coPilot?.last_name}`}
                                                                </Typography>
                                                            </div>
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))
                                }
                                {
                                    visibleCount < scheduleData.length && (
                                        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                            <Button variant="contained" onClick={loadMore}>
                                                Load More
                                            </Button>
                                        </div>
                                )}
                            </>
                            
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default FlightHistory;