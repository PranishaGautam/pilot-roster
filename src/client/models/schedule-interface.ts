import { PilotDetail } from './response-interface';

export interface ScheduleTableData {
    scheduleId: number;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    status: string;
    pilot: PilotDetail | null;
    coPilot: PilotDetail | null;
}