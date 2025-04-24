import { useEffect, useMemo, useState } from 'react'
import moment from 'moment';
import _ from 'lodash';

import Spinner from '../Spinner';
import SchedulesTable from '../SchedulesTable';

import dashboardStyles from '../../../styles/dashboard.module.css';
import DisplayCard from '../DisplayCard';
import { useAuth } from '../../context/AuthContext';
import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { PilotResponse, PilotRequests, FlightDetails } from '../../models/response-interface';
import { useToast } from '../../hooks/useToast';
import { UpdatePilotRequestPayload, UpdateRequestPayload } from '../../models/requests-interface';
import FlightDistributionChart from '../FlightDistributionChart';


const PilotDashboard = () => {

    const { token, userId } = useAuth();
    const { getAllLeaveRequests, updateLeaveRequest, getFlightDetails } = useBackendActions();
    const { successToast, errorToast } = useToast();
    
    const cardDisplayContents = [
        {
            title: 'Next Duty',
            value: moment().add(7, 'days').format('YYYY-MM-DD').toString(),
            percentageIndicator: 'positive',
            percentageChange: '12',
            date: '2025-04-01 10:00:00',
        },
        {
            title: 'Total Flight Hours',
            value: 600,
            percentageIndicator: 'positive',
            percentageChange: '12',
            date: '2025-04-01 10:00:00',
        },
        {
            title: 'Flight Hours',
            value: 14578,
            percentageIndicator: 'negative',
            percentageChange: '4',
            date: '2025-04-01 10:00:00',
        }
    ]

    const isLoadingData = isLoading('update-leave-request');

    return (
        <>
            {
                isLoadingData && 
                    <Spinner
                        color='primary'
                        size={60}
                    />
            }

            {/* ACTIVITY SECTION */}
            <section className={dashboardStyles.activitySection}>
                <h2 className={dashboardStyles.sectionTitle}>Activity</h2>
                <div className={dashboardStyles.activityCards}>
                    {cardDisplayContents.map((content, index) => (
                        <DisplayCard 
                            key={index}
                            cardTitle={content.title} 
                            cardValue={content.value} 
                            percentageIndicator={content.percentageIndicator} 
                            percentageChange={content.percentageChange} 
                            cardDate={content.date}						
                        />
                    ))}
                </div>
            </section>

            <section className={dashboardStyles.flightDistributionDiv}>
                <FlightDistributionChart/>
            </section>

            <section>
                <h2 className={dashboardStyles.sectionTitle}>Upcoming Flight Schedules</h2>
                <SchedulesTable />
            </section>
        </>
    )
}

export default PilotDashboard;