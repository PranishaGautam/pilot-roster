
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