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