import React, { useEffect, useState } from 'react';
import produce from 'immer';

import {
    Modal,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton,
    CircularProgress
} from '@mui/material';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Spinner from './Spinner';

import pilotModalListStyle from '../../styles/pilotModalList.module.css';

import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';
import { PilotResponse, FlightDetails } from '../models/response-interface';
import { toast } from 'react-toastify';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scheduleId: string | null;
    assignType: string | null;
    setAssignType: React.Dispatch<React.SetStateAction<string | null>>;
    setNeedsTableRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const PilotListModal = ({ isOpen, setIsOpen, scheduleId, assignType, setAssignType, setNeedsTableRefresh }: Props) => {

    const { token } = useAuth();
    
    const { getAllPilots, assignPilotToFlight } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);
    const [selectedPilot, setSelectedPilot] = useState<PilotResponse | null>(null);

    // Handle assign action
    const handleAssign = () => {

        setNeedsTableRefresh(false);

        if (!selectedPilot) {
            toast.error('Please select a pilot to assign!');
        }

        if (!scheduleId) {
            toast.error('Schedule ID is missing!');
            return;
        }
        if (!assignType) {
            toast.error('Assign type is missing!');
            return;
        }

        if (token && scheduleId && assignType && selectedPilot) {
            assignPilotToFlight('assign-pilot-area', token, scheduleId, { assignType, pilotId: selectedPilot.pilot_id })
            .then((response) => {
                console.log('Pilot assigned successfully:', response);
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
        <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <div className={pilotModalListStyle.InstructionsDiv}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        {'Select a Pilot'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {'Please select a pilot from the list below to assign to the flight.'}
                    </Typography>
                </div>
                
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
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={() => setIsOpen(false)} sx={{ mr: 2 }}>
                        {'Cancel'}
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
            </Box>
        </Modal>
    );
};

export default PilotListModal;