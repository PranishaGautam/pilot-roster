import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { useCallback } from 'react';

import { 
	FlightDetailQueryParams 
} from '../models/requests-interface';

import { 
	LoginPayload, LoginResponse, LoginError,
	RegisterPayload, RegisterResponse, 
	UserDetails,
	FlightDetails
} from '../models/response-interface';

import { useAuth } from '../context/AuthContext';

// Base URL for the backend API
const BASE_URL = 'http://localhost:5000/api';

// Axios instance for consistent configuration
const apiClient = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Axios instance for endpoints that require authentication
const apiClientWithAuth = (token: string) => {  
	return axios.create({
		baseURL: BASE_URL,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`, // Include the token in the Authorization header
		},
	});
};

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error.response?.data || error.message);
  throw error.response?.data || error.message;
};

interface useBackendActionsReturn {
	login: (payload: string, trackingArea: string) => Promise<LoginResponse | LoginError>;
	register: (payload: string, trackingArea: string) => Promise<RegisterResponse>;
	getUserDetailById: (userId: string, token: string, trackingArea: string) => Promise<UserDetails>;
	getAllUsers: (trackingArea: string, token: string) => Promise<Array<UserDetails>>;
	getFlightDetails: (trackingArea: string, token: string, queryParams?: FlightDetailQueryParams) => Promise<Array<FlightDetails>>;
}

export function useBackendActions(): useBackendActionsReturn {

	// Function to handle login
	// The function takes a tracking area and a payload as arguments
	const login = useCallback(async (payload: string, trackingArea: string) => {
		try {
			const response = await trackPromise(apiClient.post(`/login`, payload), trackingArea);
			if (response.status === 200) {
				return response.data as LoginResponse;
			} else {
				throw { type: 'Login Failed', message: 'Login failed. Please contact administration for support.' } as LoginError;
			}
		} catch (error: any) {
			if (error.status === 404) {
				throw { type: 'USER_NOT_FOUND', message: 'User not found. Please check your credentials.' } as LoginError;
			}

			if (error.status === 401) {
				throw { type: 'INVALID_CREDENTIALS', message: 'Invalid credentials. Please try again.' } as LoginError;
			}

			if (error.status !== 200) {
				throw { type: 'Login Failed', message: 'Login failed. Please contact adminstration for support.' } as LoginError;
			}

			throw { type: 'NETWORK_ERROR', message: 'Network error. Please try again later.' } as LoginError;
		}
	}, []);


	// Function to handle registration
	// The function takes a tracking area and a payload as arguments
	const register = useCallback(async (payload: string, trackingArea: string) => {
		try {
			const response = await trackPromise(apiClient.post(`/register`, payload), trackingArea);
			if (response.status !== 201) {
				throw new Error('Registration failed');
			}
			return response.data;
		} catch (error: any) {

			if (error.status === 409) {
				throw { type: 'EMAIL_ALREADY_REGISTERED', message: 'Email address already exists. Please try logging in.' };
			}

			if (error.status === 400) {
				if (error.response.data.code === 'INVALID_EMAIL') {
					throw { type: error.response.data.code, message: 'Invalid email address. Please enter a valid email.' }
				}
				
				if (error.response.data.code === 'INVALID_ROLE') {
					throw { type: error.response.data.code, message: 'Invalid password. Password must be at least 8 characters long.' }
				}

				throw { type: 'BAD_REQUEST', message: 'Bad request. Only pilots can register through here. Please contact administration for other roles.' };
			}

			throw { type: 'NETWORK_ERROR', message: 'Network error. Please try again later.' } 
		}
		
	}, []);

	// Function to fetch user details by ID
	const getUserDetailById = useCallback(async (userId: string, token: string, trackingArea: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/user/${userId}`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch user details', response.status);
				throw new Error('Failed to fetch user details');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const getAllUsers = useCallback(async (trackingArea: string, token: string) => {
		try {	
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/users`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch all users', response.status);
				throw new Error('Failed to fetch all users');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const getFlightDetails = useCallback(async (trackingArea: string, token: string, queryParams?: FlightDetailQueryParams) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/flights`, { params: queryParams }), trackingArea);
			// const response = await trackPromise(client.get(`/flights`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch flight details', response.status);
				throw new Error('Failed to fetch flight details');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	return {
		login,
		register,
		getUserDetailById,
		getAllUsers,
		getFlightDetails,
	}

}