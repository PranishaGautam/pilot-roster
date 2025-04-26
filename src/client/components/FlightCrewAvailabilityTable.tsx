import React, { useEffect, useState } from 'react';
import _ from 'lodash';

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    CircularProgress,
    Modal,
} from '@mui/material';

import RefreshIcon from '@mui/icons-material/Refresh';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import flightcrewStyles from '../../styles/flightCrewTable.module.css';

import { pilotRoleOptions, optionsOfAvailability } from '../utils/dropdownValues';
import { useBackendActions } from '../hooks/callBackend';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import isLoading from '../hooks/isLoading';
import { PilotResponse } from '../models/response-interface';
import { PilotUpdatePayload } from '../models/requests-interface';

const FlightCrewAvailabilityTable = () => {

    const { token } = useAuth();
    const { getAllPilots, updatePilotById } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);

    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');

    const [pilotRole, setPilotRole] = useState('');
    const [selectedPilot, setSelectedPilot] = useState<PilotResponse>();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

    // Paginated data
    const paginatedData = pilotList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const isFetchingPilotList = isLoading('pilot-area');

    useEffect(() => {
        getPilots();
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
                    <Button variant='contained' disabled={false} onClick={handleApplySelections}>{'Apply'}</Button>
                    <IconButton onClick={handleRefresh} sx={{ ml: 'auto' }}>
                        <RefreshIcon />
                    </IconButton>
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
                            {/* <TableCell>Hours Flown</TableCell> */}
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
                                                                    </>
                                                                )
                                                            }
                                                        </TableCell>
                                                        {/* <TableCell>
                                                            {pilot.hours_flown ? `${pilot.hours_flown} hrs` : '-'}
                                                        </TableCell> */}
                                                        <TableCell>
                                                            {pilot.status.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
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