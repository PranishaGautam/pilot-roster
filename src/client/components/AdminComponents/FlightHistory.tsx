import React, { useState, useContext, useMemo, useEffect } from 'react';
import _, { set } from 'lodash';
import moment from 'moment';

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter,
    Paper,
    TablePagination,
    Toolbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    IconButton,
    Button,
} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import '@fontsource/roboto/300.css';

import Spinner from '../Spinner';

import flightHistoryStyles from '../../../styles/flightHistory.module.css';

import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

import { FlightDetailQueryParams } from '../../models/requests-interface';
import { FlightDetails } from '../../models/response-interface';
import { ScheduleTableData } from '../../models/schedule-interface';
import { TablePaginationActionsProps } from '../../models/table-pagination-interface';

import { originOptions, destinationOptions, assignedOptions } from '../../utils/dropdownValues';



const FlightHistory = () => {

    const { token, role, pilotId, userId } = useAuth();

    const { getFlightDetails, getFlightDetailsByPilotId } = useBackendActions();
    const { errorToast } = useToast();

    const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

    const getFlightDetailsData = async () => {

        if (token) {
            if (role === 'admin') {
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
                    console.error('Error fetching flight details:', error);
                    errorToast('Error fetching flight details. Please try again.');
                    setScheduleData([]);
                });
            }
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
                    <h2 className={flightHistoryStyles.flightTitle}>Upcoming Flights</h2>
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
                                scheduleData.map((flight, index) => (
                                    <Accordion defaultExpanded={false}>
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
                            </>
                            
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default FlightHistory;