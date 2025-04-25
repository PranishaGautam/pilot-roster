export interface FlightDetailQueryParams {
    assigned?: string,
    pilotId?: string, 
    status?: string, 
    origin?: string,
    destination?: string,
    start_date?: string,
    end_date?: string
}

export interface PilotDetailQueryParams {
    role?: string,
    status?: string,
}

export interface AssignPilotRequestBody {
    assignType: string,
    pilotId: number,
}

export interface PilotUpdatePayload {
    license_no?: string;
    license_specs?: string;
    experience_in_yrs?: number;
    role?: string;
    hours_flown?: number;
}

export interface RequestLeavePayload {
    requestor_id: string,
    request_type: string,
    request_description: string,
    start_time: string,
    end_time: string,
    status: string
}

export interface UpdateRequestPayload {
    approver_id: string,
    status: string,
    approval_time: string
}

export interface UpdatePilotRequestPayload {
    approver_id: number,
    status: string,
    approval_time: string,
}

export interface InsertNotificationPayload {
    type: string; // e.g., "schedule_change", "request_update"
    title: string;
    message: string;
    recipient_id?: number; // ID of the user receiving the notification
    created_by: string; // ID of the user who created the notification
}
export interface UpdateNotificationStatusPayload {
    status: string
}