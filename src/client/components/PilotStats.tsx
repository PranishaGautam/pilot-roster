import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

import dashboardStyles from '../../styles/dashboard.module.css';
import pilotStyle from '../../styles/pilotpage.module.css';


const PilotStats = () => {
    return (
        <div className={dashboardStyles.activityCards}>
            <Card className={pilotStyle.card}>
                <CardContent>
                    <Typography variant="h6">Next Duty</Typography>
                    <Typography variant="body1">September 10, 2025 • 10:00 AM</Typography>
                </CardContent>
            </Card>
            
            <Card className={pilotStyle.card}>
                <CardContent>
                    <Typography variant="h6">Total Hours Flown</Typography>
                    <Typography variant="body1">3200 hrs</Typography>
                </CardContent>
            </Card>

            <Card className={pilotStyle.card}>
                <CardContent>
                    <Typography variant="h6">Requests</Typography>
                    <Typography variant="body1">2 Pending</Typography>
                </CardContent>
            </Card>

            <Card className={pilotStyle.card}>
                <CardContent>
                    <Typography variant="h6">Upcoming Training</Typography>
                    <Typography variant="body1">October 15, 2025 • 2:00 PM</Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default PilotStats;