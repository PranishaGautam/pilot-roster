import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from '@mui/material';

const PilotScheduleTable = () => {
    // NOTE: Replace with real data from API
    const [schedules] = useState([
        {
            flightNumber: 'HA1001',
            departureTime: '2025-09-15 08:00',
            arrivalTime: '2025-09-15 09:30',
            origin: 'KTM',
            destination: 'BIR',
            status: 'On Time',
        },
        {
            flightNumber: 'HA1002',
            departureTime: '2025-09-16 10:00',
            arrivalTime: '2025-09-16 11:00',
            origin: 'KTM',
            destination: 'PKR',
            status: 'Delayed',
        },
    ]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Handle pagination
    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = schedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Flight Number</TableCell>
                        <TableCell>Origin</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Departure</TableCell>
                        <TableCell>Arrival</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.map((schedule, index) => (
                        <TableRow key={index}>
                            <TableCell>{schedule.flightNumber}</TableCell>
                            <TableCell>{schedule.origin}</TableCell>
                            <TableCell>{schedule.destination}</TableCell>
                            <TableCell>{schedule.departureTime}</TableCell>
                            <TableCell>{schedule.arrivalTime}</TableCell>
                            <TableCell>{schedule.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={schedules.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
};

export default PilotScheduleTable;