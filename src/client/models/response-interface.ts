
// ****************************************************************************
//  Interface for the response from the server
// ****************************************************************************

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    role: string;
    pilot_id?: string;
    user_id?: string;
}

export interface LoginError {
    type: string;
    message: string;
}

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
   id: string;
   email: string;
   role: string;
}

export interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    start_date: string;
    end_date: string;
}

export interface FlightDetails {
    schedule: {
        schedule_id: number;
        flight_number: string;
        origin: string;
        destination: string;
        start_time: string;
        end_time: string;
        status: string; // 'SCHEDULED', 'DELAYED', 'CANCELLED', 'COMPLETED', 'ON ROUTE'
        metadata: string;
    }
    pilots?: {
        pilot?: PilotDetail | null;
        co_pilot?: PilotDetail | null;
    }
}

export interface PilotDetail {
    pilot_id: number;
    first_name: string;
    last_name: string;
    role: string;
}

export interface PilotResponse {
    pilot_id: number;
    user_id: number;
    license_no: string;
    license_specs: string;
    experience_in_yrs: number;
    role: string;
    hours_flown: number;
    first_name: string;
    last_name: string;
    email: string;
    start_date: string;
    end_date: string;
}