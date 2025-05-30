import moment from 'moment';
import React, { useEffect, useState } from 'react';

import {
    Box,
    Button,
    CircularProgress,
    Modal,
    Typography
} from '@mui/material';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import pilotModalListStyle from '../../styles/pilotModalList.module.css';

import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';
import { InsertNotificationPayload } from '../models/requests-interface';
import { PilotResponse } from '../models/response-interface';
import { ScheduleTableData } from '../models/schedule-interface';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    schedule: ScheduleTableData | null;
    assignType: string | null;
    setAssignType: React.Dispatch<React.SetStateAction<string | null>>;
    setNeedsTableRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const PilotListModal = ({ isOpen, setIsOpen, schedule, assignType, setAssignType, setNeedsTableRefresh }: Props) => {

    const { token, userId } = useAuth();
    
    const { getAllPilots, assignPilotToFlight, insertNotification } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);
    const [selectedPilot, setSelectedPilot] = useState<PilotResponse | null>(null);

    const handleNotifyPilotOnScheduleAssignment = () => {
        if (!token) return;
        if (!userId) return;

        const messageDescription = `
            You have been assigned to a flight number: ${schedule?.flightNumber}. Please check your schedule for more details. \n

            Flight Details:
            Flight Number: ${schedule?.flightNumber}\n
            Date: ${moment(schedule?.departureTime).format('DD/MM/YYYY HH')} \n
            Route: ${schedule?.origin} -> ${schedule?.destination} \n

            If you have any questions, please contact the scheduling department.
            Thank you for your cooperation. \n

            Best regards,
            Flight Scheduling Team
        `;

        const payload: InsertNotificationPayload = {
            title: 'Schedule Assignment',
            message: messageDescription,
            type: 'FLIGHT_ASSIGNMENT',
            created_by: userId,
            recipient_id: selectedPilot?.user_id
        };

        insertNotification('insert-notifications-area', token, payload)
            .then(() => {
                successToast('Notification message sent successfully!');
            })
            .catch(() => {
                console.log('Error sending notification message!');
            });
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setSelectedPilot(null);
    };

    // Handle assign action
    const handleAssign = () => {

        setNeedsTableRefresh(false);

        if (!selectedPilot) {
            toast.error('Please select a pilot to assign!');
        }

        if (!schedule?.scheduleId) {
            toast.error('Schedule ID is missing!');
            return;
        }
        if (!assignType) {
            toast.error('Assign type is missing!');
            return;
        }

        if (token && schedule?.scheduleId && assignType && selectedPilot) {
            assignPilotToFlight('assign-pilot-area', token, schedule?.scheduleId?.toLocaleString(), { assignType, pilotId: selectedPilot.pilot_id })
            .then((response) => {
                console.log('Pilot assigned successfully:', response);
                handleNotifyPilotOnScheduleAssignment();
                successToast('Pilot assigned successfully!');
                setIsOpen(false);
                setAssignType(null);
                setNeedsTableRefresh(true);
            })
            .catch((error) => {
                console.log(error);
                errorToast('Failed to assign pilot!');
            });
        }
    };

    const getPilots = () => {
        if (token) {
            getAllPilots('pilot-area', token)
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
    }

    useEffect(() => {
        getPilots();
    }, []);

    const isFetchingPilotList = isLoading('pilot-area');

    return (
        <Modal open={isOpen} onClose={handleCloseModal}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <div style={{ width: '100%', height: '100%'}}>
                    <div className={pilotModalListStyle.InstructionsDiv}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            {'Select a Pilot'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {'Please select a pilot from the list below to assign to the flight.'}
                        </Typography>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', width: '100%' }}>
                        <div className={pilotModalListStyle.pilotListDiv}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Pilot Id</TableCell>
                                            <TableCell align="left">Name</TableCell>
                                            <TableCell align="left">Role</TableCell>
                                            <TableCell align="left">Status</TableCell>
                                            <TableCell align="left">Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {
                                            isFetchingPilotList ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">
                                                        <CircularProgress color={'primary'} />
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                pilotList.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            {'No pilots available.'}
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    <>
                                                        {
                                                            pilotList.map((pilot) => (
                                                                <TableRow key={pilot.pilot_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row">
                                                                        {pilot.pilot_id}
                                                                    </TableCell>
                                                                    <TableCell align="left">{`${pilot.first_name} ${pilot.last_name}`}</TableCell>
                                                                    <TableCell align="left">{pilot.role}</TableCell>
                                                                    <TableCell align="left">{pilot.status}</TableCell>
                                                                    <TableCell align="left">
                                                                        <Button
                                                                            variant={'text'}
                                                                            color={'primary'}
                                                                            onClick={() => setSelectedPilot(pilot)}
                                                                            disabled={selectedPilot?.pilot_id === pilot.pilot_id}
                                                                        >
                                                                            {selectedPilot?.pilot_id === pilot.pilot_id ? 'Selected' : 'Select'}
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </>
                                                )
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                            {'Close'}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAssign}
                            disabled={!selectedPilot}
                        >
                            {'Assign'}
                        </Button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

export default PilotListModal;