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

import PilotListModal from './PilotListModal';

import schedulesTableStyles from '../../styles/schedulesTable.module.css';
import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import { originOptions, destinationOptions, assignedOptions } from '../utils/dropdownValues';
import { FlightDetailQueryParams } from '../models/requests-interface';
import Spinner from './Spinner';
import { FlightDetails, PilotDetail } from '../models/response-interface';

interface ScheduleTableData {
	flightNumber: string;
	origin: string;
	destination: string;
	departureTime: string;
	arrivalTime: string;
	status: string;
	pilot: PilotDetail | null;
	coPilot: PilotDetail | null;
}

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number,
	) => void;
}

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

function createScheduleData(
	flightNumber: string,
	origin: string,
	destination: string,
	departureTime: string,
	arrivalTime: string,
	status: string,
	pilot: PilotDetail | null,
	coPilot: PilotDetail | null
) {
	return {
		flightNumber,
		origin,
		destination,
		departureTime,
		arrivalTime,
		status,
		pilot,
		coPilot,
	};
}

interface Props {
	schedules: string[];
	pilots: string[];
}

const SchedulesTable = () => {

	const { token, role } = useAuth();
	console.log('Token:', token);
	console.log('Role:', role);

	const { getFlightDetails } = useBackendActions();
	const { successToast, errorToast } = useToast();

	const [page, setPage] = React.useState(0);
  	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const [scheduleData, setScheduleData] = useState<Array<ScheduleTableData>>([]);

	// const rows: Array<ScheduleTableData> = [
	// 	createScheduleData(
	// 		'AA101',
	// 		'New York',
	// 		'Los Angeles',
	// 		'2023-10-01T08:00:00',
	// 		'2023-10-01T11:00:00',
	// 		'On Time',
	// 		null,
	// 		'Jane Smith'
	// 	),
	// 	createScheduleData(
	// 		'BA202',
	// 		'London',
	// 		'Paris',
	// 		'2023-10-02T09:00:00',
	// 		'2023-10-02T10:30:00',
	// 		'Delayed',
	// 		'Alice Johnson',
	// 		'Bob Brown'
	// 	),
	// 	createScheduleData(
	// 		'CA303',
	// 		'Beijing',
	// 		'Shanghai',
	// 		'2023-10-03T14:00:00',
	// 		'2023-10-03T16:00:00',
	// 		'Cancelled',
	// 		null,
	// 		'Diana White'
	// 	),
	// 	createScheduleData(
	// 		'DA404',
	// 		'Dubai',
	// 		'Mumbai',
	// 		'2023-10-04T18:00:00',
	// 		'2023-10-04T20:30:00',
	// 		'On Time',
	// 		'Edward Green',
	// 		'Fiona Black'
	// 	),
	// 	createScheduleData(
	// 		'EA505',
	// 		'Sydney',
	// 		'Melbourne',
	// 		'2023-10-05T07:00:00',
	// 		'2023-10-05T08:30:00',
	// 		'On Time',
	// 		'George King',
	// 		null
	// 	),
	// 	createScheduleData(
	// 		'FA606',
	// 		'Tokyo',
	// 		'Osaka',
	// 		'2023-10-06T12:00:00',
	// 		'2023-10-06T13:30:00',
	// 		'On Time',
	// 		'Ian Knight',
	// 		'Julia Prince'
	// 	),
	// 	createScheduleData(
	// 		'GA707',
	// 		'Rio de Janeiro',
	// 		'Sao Paulo',
	// 		'2023-10-07T15:00:00',
	// 		'2023-10-07T16:30:00',
	// 		'On Time',
	// 		'Kevin Bishop',
	// 		'Liam Knight'
	// 	),
	// 	createScheduleData(
	// 		'HA808',
	// 		'Honolulu',
	// 		'Maui',
	// 		'2023-10-08T10:00:00',
	// 		'2023-10-08T11:30:00',
	// 		'On Time',
	// 		'Mia Turner',
	// 		'Noah Scott'
	// 	)
	// ];

	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [isAssigned, setIsAssigned] = useState('');
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().startOf('day'));
	const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(1, 'day').startOf('day'));

	const getFlightDetailsData = async () => {

		const params: FlightDetailQueryParams = {
			assigned: isAssigned,
			origin: origin,
			destination: destination,
			start_date: startDate ? `${startDate.toISOString().split('.')[0]}Z` : '',
			end_date: endDate ? `${endDate.toISOString().split('.')[0]}Z` : '',
		};

		if (token) {
			// Call the backend API with the selected parameters
			getFlightDetails('schedules-area', token, params)
			.then((response) => {
				if (response.length === 0) {
					errorToast('No schedules found for the selected criteria.');
				} else {
					const formattedSchedules = response.map((schedule: FlightDetails) => {

						const assignedPilot = schedule?.pilots?.pilot ?? null;
						const assignedCoPilot = schedule?.pilots?.co_pilot ?? null;

						return createScheduleData(
							schedule.schedule.flight_number,
							schedule.schedule.origin,
							schedule.schedule.destination,
							moment(schedule.schedule.start_time).format('YYYY-MM-DD HH:mm:ss'),
							moment(schedule.schedule.end_time).format('YYYY-MM-DD HH:mm:ss'),
							schedule.schedule.status,
							assignedPilot ?? null,
							assignedCoPilot ?? null
						);
					});
					setScheduleData(formattedSchedules);
					successToast('Schedules fetched successfully!');
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

	const isFetchingData = isLoading('schedules-area');

	const [isPilotListModalOpen, setIsPilotListModalOpen] = useState(false);

	const handlePilotAssignment = (pilotId: string) => {
		// Handle pilot assignment logic here
		console.log(`Pilot ${pilotId} assigned`);
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

	return (
		<>
			{
				isFetchingData && 
					<Spinner
						color='primary'
						size={60}
					/>
			}
			<Box>
				<Toolbar className={schedulesTableStyles.toolbarStyles}>
					<div className={schedulesTableStyles.selections}>
						<div className={schedulesTableStyles.topRow}>
							<FormControl sx={{ m: 1, minWidth: 200 }} size="medium">
								<InputLabel id="simple-select-label-origin">Origin</InputLabel>
								<Select
									labelId="simple-select-label-origin"
									id="simple-select-medium"
									value={origin}
									label="Origin"
									onChange={(event: SelectChangeEvent) => setOrigin(event.target.value)}
									autoWidth
									size='medium'
								>
									{
										originOptions.map((option, index) => (
											<MenuItem key={index} value={option.value}>
												{option.label}
											</MenuItem>
										))
									}
								</Select>
							</FormControl>
			
							<FormControl sx={{ m: 1, minWidth: 200 }} size="medium">
								<InputLabel id="simple-select-label-role">Destination</InputLabel>
								<Select
									labelId="simple-select-label-role"
									id="simple-select-medium"
									value={destination}
									label="Destination"
									onChange={(event: SelectChangeEvent) => setDestination(event.target.value)}
									autoWidth
									size='medium'
								>
									{destinationOptions.map((option, index) => (
										<MenuItem key={index} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl sx={{ m: 1, minWidth: 200 }} size="medium">
								<InputLabel id="simple-select-label-role">Assignment</InputLabel>
								<Select
									labelId="simple-select-label-role"
									id="simple-select-medium"
									value={isAssigned}
									label="Assignment"
									onChange={(event: SelectChangeEvent) => setIsAssigned(event.target.value)}
									autoWidth
									size='medium'
								>
									{
										assignedOptions.map((option, index) => (
											<MenuItem key={index} value={option.value}>
												{option.label}
											</MenuItem>
										))
									}
								</Select>
							</FormControl>
						</div>

						<div className={schedulesTableStyles.bottomRow}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label="Departure Date"
									value={startDate}
									onChange={(newValue) => setStartDate(newValue)}
								/>

								<DatePicker
									label="Arrival Date"
									value={endDate}
									onChange={(newValue) => setEndDate(newValue)}
								/>
							</LocalizationProvider>
						</div>
					</div>

					<div className={schedulesTableStyles.buttonDiv}>
						<Button variant='contained' disabled={false} onClick={handleScheduleSelections}>{'Apply'}</Button>
						<IconButton onClick={handleRefreshSelections} sx={{ ml: 'auto' }}>
							<RefreshIcon />
						</IconButton>
					</div>
					
				</Toolbar>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
						<TableHead>
							<TableRow>
								<TableCell>Flight Number</TableCell>
								<TableCell>Origin</TableCell>
								<TableCell>Destination</TableCell>
								<TableCell>Departure Time</TableCell>
								<TableCell>Arrival Time</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Pilot</TableCell>
								<TableCell>Co-Pilot</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								(scheduleData && scheduleData?.length > 0) ? (
									((rowsPerPage > 0) ? scheduleData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : scheduleData)
									.map((row, index) => (
										<TableRow key={index}>
											<TableCell component="th" scope="row">
												{row.flightNumber}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{row.origin}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{row.destination}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{moment(row.departureTime).format('YYYY-MM-DD HH:mm:ss')}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{moment(row.arrivalTime).format('YYYY-MM-DD HH:mm:ss')}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{row.status}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{
													(row.pilot !== null )
														? `${row.pilot.first_name} ${row.pilot.last_name}` 
														: (
															<Button variant='outlined' disabled={false} onClick={() => setIsPilotListModalOpen(true)}>{'Assign'}</Button>
														)
												}
											</TableCell>
											<TableCell style={{ width: 160 }} align="left">
												{
													(row.coPilot !== null)
														? `${row.coPilot.first_name} ${row.coPilot.last_name}` 
														: (
															<Button variant='outlined' disabled={false} onClick={() => setIsPilotListModalOpen(true)}>{'Assign'}</Button>
														)
												}
											</TableCell>
										</TableRow>
										)
									)
								) : (
									<TableRow>
										<TableCell colSpan={8} align="center">
											No schedules found.
										</TableCell>
									</TableRow>
								)
							}
							{
								(emptyRows > 0) && (
									<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
									</TableRow>
								)
							}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
									count={scheduleData.length}
									rowsPerPage={rowsPerPage}
									page={page}
									// slotProps={{
									// 	select: {
									// 	inputProps: {
									// 		'aria-label': 'rows per page',
									// 	},
									// 	native: true,
									// 	},
									// }}
									onPageChange={handleChangePage}
									onRowsPerPageChange={handleChangeRowsPerPage}
									ActionsComponent={TablePaginationActions}
								/>
							</TableRow>
						</TableFooter>
				</Table>
				</TableContainer>
			</Box>
			
			<PilotListModal 
				isOpen={isPilotListModalOpen} 
				setIsOpen={setIsPilotListModalOpen} 
				onAssign={handlePilotAssignment}
			/>
		</>
	);

}

export default SchedulesTable;