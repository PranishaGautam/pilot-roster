import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    IconButton
} from '@mui/material';

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAssign: (pilotId: string) => void;
}

const PilotListModal = ({ isOpen, setIsOpen, onAssign }: Props) => {
    
    const [selectedPilot, setSelectedPilot] = useState<string | null>(null);

    // Sample list of pilots
    const pilots = [
        'Abhishek Bhandari',
        'Prativa Shrestha',
        'Ramesh Karki',
        'Sita Rai',
    ];

    // Handle pilot selection
    const handleSelectPilot = (pilot: string) => {
        setSelectedPilot(pilot);
    };

    // Handle assign action
    const handleAssign = () => {
        if (selectedPilot) {
            onAssign(selectedPilot); // Call the parent method with the selected pilot
            setIsOpen(false); // Close the modal
        }
    };

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
                    {pilots.map((pilot, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton
                                selected={selectedPilot === pilot}
                                onClick={() => handleSelectPilot(pilot)}
                            >
                                <ListItemText primary={pilot} />
                            </ListItemButton>
                        </ListItem>
                    ))}
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