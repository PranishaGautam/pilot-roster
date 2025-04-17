import React, { useEffect, useState } from 'react';
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

import Spinner from './Spinner';

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
}

const PilotListModal = ({ isOpen, setIsOpen, scheduleId, assignType, setAssignType }: Props) => {

    const { token } = useAuth();
    
    const { getAllPilots, assignPilotToFlight } = useBackendActions();
    const { successToast, errorToast } = useToast();

    const [pilotList, setPilotList] = useState<Array<PilotResponse>>([]);
    const [selectedPilot, setSelectedPilot] = useState<PilotResponse | null>(null);

    // Handle assign action
    const handleAssign = () => {
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
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Select a Pilot
                </Typography>
                <List>
                    {
                        isFetchingPilotList ? (
                            <CircularProgress color={'primary'} />
                        ) : (
                            <>
                                {
                                    pilotList.length === 0 ? (
                                        <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                                            No pilots available.
                                        </Typography>
                                    ) : (
                                        pilotList.map((pilot, index) => (
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton
                                                    selected={selectedPilot === pilot}
                                                    onClick={() => setSelectedPilot(pilot)}
                                                >
                                                    <ListItemText primary={`${pilot.first_name} ${pilot.last_name}`} />
                                                </ListItemButton>
                                            </ListItem>
                                        ))
                                    )
                                    
                                }
                            </>
                        )
                    }
                    
                </List>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={() => setIsOpen(false)} sx={{ mr: 2 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssign}
                        disabled={!selectedPilot}
                    >
                        Assign
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default PilotListModal;