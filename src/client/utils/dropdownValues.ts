// This file contains the dropdown values for the various dropdowns in the application.

// *************************************
// Flight Schedule Table
// *************************************

export const originOptions = [
    { label: 'New York', value: 'New York' },
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'London', value: 'London' },
    { label: 'Paris', value: 'Paris' },
    { label: 'Beijing', value: 'Beijing' },
    { label: 'Shanghai', value: 'Shanghai' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Kathmandu', value: 'Kathmandu' },
    { label: 'Pokhara', value: 'Pokhara' },
    { label: 'Sydney', value: 'Sydney' },
    { label: 'Tokyo', value: 'Tokyo' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Bangkok', value: 'Bangkok' },
    { label: 'Biratnagar', value: 'Biratnagar' },
    { label: 'Bharatpur', value: 'Bharatpur' },
    { label: 'Lukla', value: 'Lukla' },
    { label: 'Janakpur', value: 'Janakpur' },
    { label: 'Nepalgunj', value: 'Nepalgunj' },
    { label: 'Simara', value: 'Simara' },
];

export const destinationOptions = [
    { label: 'New York', value: 'New York' },
    { label: 'Los Angeles', value: 'Los Angeles' },
    { label: 'London', value: 'London' },
    { label: 'Paris', value: 'Paris' },
    { label: 'Beijing', value: 'Beijing' },
    { label: 'Shanghai', value: 'Shanghai' },
    { label: 'Dubai', value: 'Dubai' },
    { label: 'Mumbai', value: 'Mumbai' },
    { label: 'Kathmandu', value: 'Kathmandu' },
    { label: 'Pokhara', value: 'Pokhara' },
    { label: 'Sydney', value: 'Sydney' },
    { label: 'Tokyo', value: 'Tokyo' },
    { label: 'Singapore', value: 'Singapore' },
    { label: 'Bangkok', value: 'Bangkok' },
    { label: 'Biratnagar', value: 'Biratnagar' },
    { label: 'Bharatpur', value: 'Bharatpur' },
    { label: 'Lukla', value: 'Lukla' },
    { label: 'Janakpur', value: 'Janakpur' },
    { label: 'Nepalgunj', value: 'Nepalgunj' },
    { label: 'Simara', value: 'Simara' },
];

export const assignedOptions = [
    { label: 'Assigned', value: 'true' },
    { label: 'Not Assigned', value: 'false' }
];

export const statusOptions = [
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Delayed', value: 'DELAYED' },
    { label: 'Cancelled', value: 'CANCELLED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'On Route', value: 'ON ROUTE' }
];

// *************************************
// Flight Crew Availability Table
// *************************************

export const pilotRoleOptions = [
    { value: 'Senior Captain', label: 'Senior Captain' },
    { value: 'Captain', label: 'Captain' },
    { value: 'First Officer', label: 'First Officer' }
];

export const optionsOfAvailability = [
        { value: 'available', label: 'Available' },
        { value: 'stand by', label: 'Stand By' },
        { value: 'time off', label: 'On Leave' },
        { value: 'in flight', label: 'On Duty' }
];

export const notificationTypes = [
    { label: 'Flight Schedule', value: 'FLIGHT_SCHEDULE' },
    { label: 'Flight Delay', value: 'FLIGHT_DELAY' },
    { label: 'Flight Cancellation', value: 'FLIGHT_CANCELLATION' },
    { label: 'Flight Assignment', value: 'FLIGHT_ASSIGNMENT' },
    { label: 'Info', value: 'INFO' },
    { label: 'Alert', value: 'ALERT' },
    { label: 'Reminder', value: 'REMINDER' }
]