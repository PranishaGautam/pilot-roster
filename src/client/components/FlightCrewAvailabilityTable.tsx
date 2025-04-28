import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import moment from 'moment';

import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Toolbar,
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import flightcrewStyles from '../../styles/flightCrewTable.module.css';

import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';
import { PilotUpdatePayload } from '../models/requests-interface';
import { PilotRequests, PilotResponse } from '../models/response-interface';
import { optionsOfAvailability, pilotRoleOptions } from '../utils/dropdownValues';
import { ScheduleTableData } from '../models/schedule-interface';

interface Props {
    scheduleDataProp: Array<ScheduleTableData>;
    pilotListProp: Array<PilotResponse>;
}

const FlightCrewAvailabilityTable = ({ scheduleDataProp, pilotListProp }: Props) => {

    const { token } = useAuth();
    const { getAllPilots, updatePilotById, getAllLeaveRequests } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);

    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');

    const [pilotRole, setPilotRole] = useState('');
    const [selectedPilot, setSelectedPilot] = useState<PilotResponse>();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                ])
            )
        );
        return uniquePilotIds;
    }, [scheduleDataProp]);

    const [requests, setRequests] = useState<Array<PilotRequests>>([]);

    const getAllRequests = () => {
        if (token) {
            getAllLeaveRequests('leave-requests', token)
                .then((data) => {
                    setRequests(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // console.log('No token found!');
        }
    }

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
        const allPilotIds = pilotListProp.map(pilot => pilot.pilot_id);
        const unavailablePilotIds = [...inFlightPilots, ...onLeavePilots];
        const availablePilotIds = allPilotIds.filter(pilotId => !unavailablePilotIds.includes(pilotId));
        return availablePilotIds.map(pilotId => {
            const pilot = pilotListProp.find(pilot => pilot.pilot_id === pilotId);
            return pilot ? { ...pilot, status: 'available' } : null;
        });
    }, [pilotListProp, inFlightPilots, onLeavePilots]);

    const handleSelectAvailability = (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
    };
    
    const getPilots = () => {
        const params = {
            status: status,
            role: role,
        }

        if (token) {
            getAllPilots('pilot-area', token, params)
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

    const handleEditPilotUpdate = (pilot: PilotResponse, toUpdateParam: keyof PilotUpdatePayload) => {
        setIsEditModalOpen(true);
        setSelectedPilot(pilot);
    }

    const handleRoleSelection = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    const handleUpdatePilotDetails = (updateKey: keyof PilotUpdatePayload, value: any, pilotId: number | undefined) => {

        if (!pilotId) {
            errorToast('Pilot ID is missing!');
            return;
        }

        const payload: PilotUpdatePayload = {
            [updateKey]: value
        }

        if (token) {
            updatePilotById('pilot-area', token, pilotId.toLocaleString(), payload)
                .then((response) => {
                    console.log('Pilot details updated successfully:', response);
                    successToast('Pilot details updated successfully!');
                    getPilots(); // Refresh the pilot list after updating
                })
                .catch((error) => { 
                    console.log(error);
                    errorToast('Failed to update pilot details!');
                })
                .finally(() => {
                    setIsEditModalOpen(false); // Close the modal after updating
                });
        }
    };

    // Logic to call backend to refresh data
    const handleApplySelections = () => {
        getPilots();
    };

    // Handle refresh action
    const handleRefresh = () => {
        setStatus('');
        setRole('');
        getPilots();
        setPage(0); // Reset pagination to the first page
    };

    const handleRefreshAvailabilityStatus = () => {
        return true;
    };

    // State for pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const pilotListWithStatus = useMemo(() => {
        const pilotStatusMap = new Map<number, string>();

        inFlightPilots.forEach(pilotId => {
            if (pilotId !== undefined) {
                pilotStatusMap.set(pilotId, 'In Flight');
            }
        });

        onLeavePilots.forEach(pilotId => {
            if (pilotId !== undefined) {
                pilotStatusMap.set(pilotId, 'On Leave');
            }
        });

        availablePilots.forEach(pilot => {
            if (pilot?.pilot_id) {
                pilotStatusMap.set(pilot.pilot_id, 'Available');
            }
        });

        return Array.from(pilotStatusMap.entries()).map(([pilotId, status]) => ({ pilotId, status }));
    }, [pilotList, pilotListProp, inFlightPilots, onLeavePilots, availablePilots]);

    // Paginated data
    const paginatedData = pilotList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    // const paginatedData = pilotListWithStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const isFetchingPilotList = isLoading('pilot-area');

    useEffect(() => {
        getPilots();
        getAllRequests();
    }, []);

    return (
        <Box>
            {/* Toolbar for filters */}
            <Toolbar className={flightcrewStyles.toolbarStyles}>
                <div className={flightcrewStyles.selectionsDiv}>
                    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                        <InputLabel id="simple-select-label-availability">Availability</InputLabel>
                        <Select
                            labelId="simple-select-label-availability"
                            id="simple-select-small"
                            value={status}
                            label="Availability"
                            onChange={handleSelectAvailability}
                            autoWidth
                            size='small'
                        >
                            {optionsOfAvailability.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>

                    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                        <InputLabel id="simple-select-label-role">Role</InputLabel>
                        <Select
                            labelId="simple-select-label-role"
                            id="simple-select-small"
                            value={role}
                            label="Role"
                            onChange={handleRoleSelection}
                            autoWidth
                            size='small'
                        >
                            {pilotRoleOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>
                </div>
                
                <div className={flightcrewStyles.buttonDiv}>
                    {/* <Button variant='contained' disabled={false} onClick={handleRefreshAvailabilityStatus}>{'Refresh Availability Status'}</Button> */}
                    <Button variant='contained' disabled={false} onClick={handleApplySelections}>{'Apply'}</Button>
                    <Button variant='outlined' color='primary' disabled={false} onClick={handleRefresh}>{'Reset'}</Button>
                </div>
            </Toolbar>

            {/* Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Pilot ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Availability</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            isFetchingPilotList ? (
                                <TableRow>
                                    <TableCell colSpan={9} align="center">
                                        <CircularProgress color={'primary'} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                <>
                                    {
                                        pilotList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                                                    No pilots found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <>
                                                {paginatedData.map((pilot, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{pilot.pilot_id}</TableCell>
                                                        <TableCell>
                                                            {`${_.capitalize(pilot.first_name)} ${_.capitalize(pilot.last_name)}`}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                !pilot.role ? (
                                                                    <>
                                                                        <IconButton onClick={() => handleEditPilotUpdate(pilot, 'role')}>
                                                                            <EditOutlinedIcon fontSize='small' color='primary'/>
                                                                        </IconButton>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {_.startCase(_.toLower(pilot.role))}
                                                                        {
                                                                            <>
                                                                                <IconButton onClick={() => handleEditPilotUpdate(pilot, 'role')}>
                                                                                    <EditOutlinedIcon fontSize='small' color='primary'/>
                                                                                </IconButton>
                                                                            </>
                                                                        }
                                                                    </>
                                                                )
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {pilotListWithStatus.find(p => p.pilotId === pilot.pilot_id)?.status ?? 'N/A'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </TableBody>
                </Table>
                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={pilotList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Edit Modal */}
            <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className={flightcrewStyles.modal}>
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
                    <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                        <InputLabel id="simple-select-label-role">Role</InputLabel>
                        <Select
                            labelId="simple-select-label-role"
                            id="simple-select-small"
                            value={pilotRole}
                            label="Role"
                            onChange={(event) => setPilotRole(event.target.value)}
                            autoWidth
                            size='small'
                        >
                            {pilotRoleOptions.map((option, index) => (
                                <MenuItem key={index} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                            
                        </Select>
                    </FormControl>
                    <Button variant='contained' onClick={() => handleUpdatePilotDetails('role', pilotRole, selectedPilot?.pilot_id)}>Save</Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default FlightCrewAvailabilityTable;