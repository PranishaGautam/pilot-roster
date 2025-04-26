import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface SpinnerProps {
    color?: 'primary' | 'secondary' | 'inherit';
    size?: number;
}

const Spinner: React.FC<SpinnerProps> = ({ color = 'primary', size = 40 }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 9999,
            }}
        >
            <CircularProgress color={color} size={size} />
        </Box>
    );
};

export default Spinner;