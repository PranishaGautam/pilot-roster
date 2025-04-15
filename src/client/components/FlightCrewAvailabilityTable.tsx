import React, { useState } from 'react';
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
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import flightcrewStyles from '../../styles/flightCrewTable.module.css';

const FlightCrewAvailabilityTable = () => {
    // Sample data for pilots
    const [crewData, setCrewData] = useState([
        {
            id: 'P001',
            firstName: 'John',
            lastName: 'Doe',
            role: 'Captain',
            hoursFlown: 12,
            availability: 'Available',
        },
        {
            id: 'P002',
            firstName: 'Jane',
            lastName: 'Smith',
            role: 'First Officer',
            hoursFlown: 8,
            availability: 'Unavailable',
        },
        {
            id: 'P003',
            firstName: 'Alice',
            lastName: 'Johnson',
            role: 'Captain',
            hoursFlown: 15,
            availability: 'Available',
        },
        {
            id: 'P004',
            firstName: 'Bob',
            lastName: 'Brown',
            role: 'First Officer',
            hoursFlown: 10,
            availability: 'Available',
        },
        {
            id: 'P005',
            firstName: 'Charlie',
            lastName: 'Davis',
            role: 'Captain',
            hoursFlown: 5,
            availability: 'Unavailable',
        },
        {
            id: 'P006',
            firstName: 'David',
            lastName: 'Wilson',
            role: 'First Officer',
            hoursFlown: 20,
            availability: 'Available',
        },
        {
            id: 'P007',
            firstName: 'Eve',
            lastName: 'Garcia',
            role: 'Captain',
            hoursFlown: 18,
            availability: 'Available',
        },
        {
            id: 'P008',
            firstName: 'Frank',
            lastName: 'Martinez',
            role: 'First Officer',
            hoursFlown: 7,
            availability: 'Unavailable',
        },
        {
            id: 'P009',
            firstName: 'Grace',
            lastName: 'Hernandez',
            role: 'Captain',
            hoursFlown: 14,
            availability: 'Available',
        },
        {
            id: 'P010',
            firstName: 'Henry',
            lastName: 'Lopez',
            role: 'First Officer',
            hoursFlown: 11,
            availability: 'Available',
        },
    ]);

    const [availability, setAvailability] = React.useState('');

    const optionsOfAvailability = [
        { value: 'Available', label: 'Available' },
        { value: 'Unavailable', label: 'Unavailable' }
    ];
    
    const handleSelectAvailability = (event: SelectChangeEvent) => {
        setAvailability(event.target.value as string);
    };

    const [role, setRole] = React.useState('');
    const roleOptions = [
        { value: 'Captain', label: 'Captain' },
        { value: 'First Officer', label: 'First Officer' },
        { value: 'Second Officer', label: 'Second Office' }
    ];

    const handleRoleSelection = (event: SelectChangeEvent) => {
        setRole(event.target.value as string);
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
    const paginatedData = crewData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box>
            {/* Toolbar for filters */}
            <Toolbar className={flightcrewStyles.toolbarStyles}>
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
                        {roleOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                        
                    </Select>
                </FormControl>

                <IconButton onClick={handleRefresh} sx={{ ml: 'auto' }}>
                    <RefreshIcon />
                </IconButton>
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
                        {paginatedData.map((crew, index) => (
                            <TableRow key={index}>
                                <TableCell>{crew.id}</TableCell>
                                <TableCell>{`${crew.firstName} ${crew.lastName}`}</TableCell>
                                <TableCell>{crew.role}</TableCell>
                                <TableCell>{crew.hoursFlown} hrs</TableCell>
                                <TableCell>{crew.availability}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* Pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={crewData.length}
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