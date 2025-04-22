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

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import RefreshIcon from '@mui/icons-material/Refresh';
import CircularProgress from '@mui/material/CircularProgress';

import Spinner from '../Spinner';

import schedulesTableStyles from '../../../styles/schedulesTable.module.css';

import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';

import { FlightDetailQueryParams } from '../../models/requests-interface';
import { FlightDetails } from '../../models/response-interface';
import { ScheduleTableData } from '../../models/schedule-interface';
import { TablePaginationActionsProps } from '../../models/table-pagination-interface';

import { originOptions, destinationOptions, assignedOptions } from '../../utils/dropdownValues';

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const FlightHistory = () => {

    const { token, role, pilotId, userId } = useAuth();

    const { getFlightDetails, getFlightDetailsByPilotId } = useBackendActions();
    const { errorToast } = useToast();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

    const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
    const [assignPilotType, setPilotAssignType] = useState<string | null>(null);
    const [isPilotListModalOpen, setIsPilotListModalOpen] = useState(false);

    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [isAssigned, setIsAssigned] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null); // If needed to add a particular date, for the day , replace null with dayjs().startOf('day')
    const [endDate, setEndDate] = useState<Dayjs | null>(null); // If needed to add a particular date, for the day , replace null with dayjs().add(1, 'day').startOf('day')

    const getFlightDetailsData = async () => {

        const params: FlightDetailQueryParams = {
            assigned: isAssigned,
            origin: origin,
            destination: destination,
            start_date: startDate ? `${startDate.toISOString().split('.')[0]}Z` : '',
            end_date: endDate ? `${endDate.toISOString().split('.')[0]}Z` : '',
        };

        if (token) {
            if (role === 'admin') {
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

    // Handler to refresh selections
    const handleRefreshSelections = () => {
        setOrigin('');
        setDestination('');
        setIsAssigned('');
        setStartDate(null);
        setEndDate(null);
        setPage(0);
    }

    // Handle schedule selections and fetch flight details
    const handleScheduleSelections = () => {
        getFlightDetailsData();
        setPage(0);
    }

    //Handler to assign the pilot to the flight
    const handlePilotAssignment = (flight: ScheduleTableData, assignType: string) => {
        setSelectedScheduleId(flight.scheduleId.toString());
        setPilotAssignType(assignType);
        setIsPilotListModalOpen(true);
    }

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - scheduleData?.length) : 0;

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number,) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        // Fetch flight details when the component mounts or when the token changes
        if (token) {
            getFlightDetailsData();
        }
    }, []);

    const isFetchingData = isLoading('schedules-area');

    return (
        <div>
            
        </div>
    );
}

export default FlightHistory;