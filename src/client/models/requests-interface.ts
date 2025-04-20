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
    availability?: string,
}

export interface AssignPilotRequestBody {
    assignType: string,
    pilotId: number,
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