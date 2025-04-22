import React from 'react';

import SchedulesTable from '../SchedulesTable';

import dashboardStyles from '../../../styles/dashboard.module.css';

const Schedule = () => {
    return (
        <section>
            <h2 className={dashboardStyles.sectionTitle}>Flight Schedules</h2>
            <SchedulesTable />
        </section>
    )
}

export default Schedule