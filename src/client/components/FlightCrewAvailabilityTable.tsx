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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import flightcrewStyles from '../../styles/flightCrewTable.module.css';

import { pilotRoleOptions, optionsOfAvailability } from '../utils/dropdownValues';
import { useBackendActions } from '../hooks/callBackend';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import isLoading from '../hooks/isLoading';
import { PilotResponse } from '../models/response-interface';
import Spinner from './Spinner';

const FlightCrewAvailabilityTable = () => {

    const { token } = useAuth();
    const { getAllPilots } = useBackendActions();
    const { successToast, errorToast } = useToast();

    // Sample data for pilots
    // const [crewData, setCrewData] = useState([
    //     {
    //         id: 'P001',
    //         firstName: 'John',
    //         lastName: 'Doe',
    //         role: 'Captain',
    //         hoursFlown: 12,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P002',
    //         firstName: 'Jane',
    //         lastName: 'Smith',
    //         role: 'First Officer',
    //         hoursFlown: 8,
    //         availability: 'Unavailable',
    //     },
    //     {
    //         id: 'P003',
    //         firstName: 'Alice',
    //         lastName: 'Johnson',
    //         role: 'Captain',
    //         hoursFlown: 15,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P004',
    //         firstName: 'Bob',
    //         lastName: 'Brown',
    //         role: 'First Officer',
    //         hoursFlown: 10,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P005',
    //         firstName: 'Charlie',
    //         lastName: 'Davis',
    //         role: 'Captain',
    //         hoursFlown: 5,
    //         availability: 'Unavailable',
    //     },
    //     {
    //         id: 'P006',
    //         firstName: 'David',
    //         lastName: 'Wilson',
    //         role: 'First Officer',
    //         hoursFlown: 20,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P007',
    //         firstName: 'Eve',
    //         lastName: 'Garcia',
    //         role: 'Captain',
    //         hoursFlown: 18,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P008',
    //         firstName: 'Frank',
    //         lastName: 'Martinez',
    //         role: 'First Officer',
    //         hoursFlown: 7,
    //         availability: 'Unavailable',
    //     },
    //     {
    //         id: 'P009',
    //         firstName: 'Grace',
    //         lastName: 'Hernandez',
    //         role: 'Captain',
    //         hoursFlown: 14,
    //         availability: 'Available',
    //     },
    //     {
    //         id: 'P010',
    //         firstName: 'Henry',
    //         lastName: 'Lopez',
    //         role: 'First Officer',
    //         hoursFlown: 11,
    //         availability: 'Available',
    //     },
    // ]);

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);

    const [availability, setAvailability] = useState('');
    const [role, setRole] = useState('');

    const handleSelectAvailability = (event: SelectChangeEvent) => {
        setAvailability(event.target.value as string);
    };

    
    const getPilots = () => {
        const params = {
            availability: availability,
            role: role,
        }

        if (token) {
            getAllPilots('pilot-area', token, params)
                .then((data) => {
                    // successToast('Pilots fetched successfully!');
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

    const handleRoleSelection = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
    };

    // Logic to call backend to refresh data
    const handleApplySelections = () => {
        getPilots();
    };

    // Handle refresh action
    const handleRefresh = () => {
        setAvailability('');
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
                            value={availability}
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
                            <TableCell>Hours Flown (Past 5 Days)</TableCell>
                            <TableCell>Availability</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            isFetchingPilotList ? (
                                <Spinner
                                    color='primary'
                                    size={60}
                                />
                            ) : (
                                <>
                                    {
                                        pilotList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                                                    No pilots available.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            <>
                                                {paginatedData.map((pilot, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{pilot.pilot_id}</TableCell>
                                                        <TableCell>{`${_.capitalize(pilot.first_name)} ${_.capitalize(pilot.last_name)}`}</TableCell>
                                                        <TableCell>{_.startCase(_.toLower(pilot.role))}</TableCell>
                                                        <TableCell>{pilot.hours_flown} hrs</TableCell>
                                                        <TableCell>{'-'}</TableCell>
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
        </Box>
    );
};

export default FlightCrewAvailabilityTable;