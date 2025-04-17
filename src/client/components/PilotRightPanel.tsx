import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const PilotRightPanel = () => {
    return (
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Requests & Alerts
            </Typography>
            <TextField
                fullWidth
                variant="outlined"
                label="Request Something"
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" fullWidth>
                Submit Request
            </Button>

            <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Alerts:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    • Duty shift changed for Flight HA1002
                </Typography>
                <Typography variant="body2">
                    • New schedule published for next month
                </Typography>
            </Box>
        </Box>
    );
};

export default PilotRightPanel;