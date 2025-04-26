import axios from 'axios';
import { useCallback } from 'react';
import { trackPromise } from 'react-promise-tracker';

import {
	AssignPilotRequestBody,
	FlightDetailQueryParams,
	InsertNotificationPayload,
	PilotDetailQueryParams,
	PilotUpdatePayload,
	UpdateNotificationStatusPayload,
	UpdatePilotRequestPayload,
} from '../models/requests-interface';

import {
	FlightDetails,
	LoginError,
	LoginResponse,
	NotificationResponse,
	NotificationUpdateResponse,
	PilotRequests,
	PilotResponse,
	RegisterResponse,
	UserDetails,
} from '../models/response-interface';

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
	getFlightDetailsByPilotId: (trackingArea: string, token: string, pilotId: string, queryParams?: FlightDetailQueryParams) => Promise<Array<FlightDetails>>;
	getAllPilots: (trackingArea: string, token: string, queryParams?: PilotDetailQueryParams) => Promise<Array<PilotResponse>>;
	getPilotById: (trackingArea: string, token: string, userId: string) => Promise<PilotResponse>;
	updatePilotById: (trackingArea: string, token: string, pilotId: string, body: PilotUpdatePayload) => Promise<PilotResponse>;
	assignPilotToFlight: (trackingArea: string, token: string, scheduleId: string, body: AssignPilotRequestBody) => Promise<void>;
	leaveRequest: (trackingArea: string, token: string, body: any) => Promise<void>;
	updateLeaveRequest: (trackingArea: string, token: string, requestId: number, body: UpdatePilotRequestPayload) => Promise<void>;
	getAllLeaveRequests: (trackingArea: string, token: string) => Promise<Array<PilotRequests>>;
	getLeaveRequestsByPilotId: (trackingArea: string, token: string, pilotId: string) => Promise<Array<PilotRequests>>;
	getAllNotifications: (trackingArea: string, token: string) => Promise<Array<NotificationResponse>>;
	getNotificationsByUserId: (userId: string, token: string, trackingArea: string) => Promise<Array<NotificationResponse>>;
	insertNotification: (trackingArea: string, token: string, body: InsertNotificationPayload) => Promise<NotificationUpdateResponse>;
	updateNotificationStatus: (trackingArea: string, token: string, notificationId: number, Body: UpdateNotificationStatusPayload) => Promise<NotificationUpdateResponse>;
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
			const response = await trackPromise(client.get(`/users/user/${userId}`), trackingArea);
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

	const getFlightDetailsByPilotId = useCallback(async (trackingArea: string, token: string, pilotId: string, queryParams?: FlightDetailQueryParams) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/flights/${pilotId}`, { params: queryParams }), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch flight details for pilot', response.status);
				throw new Error('Failed to fetch flight details');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const getAllPilots = useCallback(async (trackingArea: string, token: string, queryParams?: PilotDetailQueryParams) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/pilots`, { params: queryParams }), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch all pilots', response.status);
				throw new Error('Failed to fetch all pilots');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const getPilotById = useCallback(async (userId: string, token: string, trackingArea: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/pilots/pilot/${userId}`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch pilot details', response.status);
				throw new Error('Failed to fetch pilot details');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const assignPilotToFlight = useCallback(async (trackingArea: string, token: string, scheduleId: string, body: AssignPilotRequestBody) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.put(`/schedules/assign/${scheduleId}`, body), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to assign pilot to flight', response.status);
				throw new Error('Failed to assign pilot to flight');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const updatePilotById = useCallback(async (trackingArea: string, token: string, pilotId: string, body: PilotUpdatePayload) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.put(`/pilots/pilot/${pilotId}`, body), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to update pilot details', response.status);
				throw new Error('Failed to update pilot details');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const getAllLeaveRequests = useCallback(async (trackingArea: string, token: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/pilotRequests`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch all leave requests', response.status);
				throw new Error('Failed to fetch all leave requests');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const getLeaveRequestsByPilotId = useCallback(async (trackingArea: string, token: string, pilotId: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/pilotRequests/pilot/${pilotId}`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch leave requests for pilot', response.status);
				throw new Error('Failed to fetch leave requests for pilot');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const leaveRequest = useCallback(async (trackingArea: string, token: string, body: any) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.post(`/pilotRequests/requestLeave`, body), trackingArea);
			if (response.status !== 201) {
				console.log('Failed to submit leave request', response.status);
				throw new Error('Failed to submit leave request');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const updateLeaveRequest = useCallback(async (trackingArea: string, token: string, requestId: number, body: UpdatePilotRequestPayload) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.put(`/pilotRequests/update/${requestId}`, body), trackingArea);
			if (response.status !== 201) {
				console.log(`Failed to update leave request for requestId: ${requestId}`, response.status);
				throw new Error('Failed to approve leave request');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const getAllNotifications = useCallback(async (trackingArea: string, token: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/notifications`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch all notifications', response.status);
				throw new Error('Failed to fetch all notifications');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
	}, []);

	const getNotificationsByUserId = useCallback(async (userId: string, token: string, trackingArea: string) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.get(`/notifications/notification/${userId}`), trackingArea);
			if (response.status !== 200) {
				console.log('Failed to fetch notifications by user ID', response.status);
				throw new Error('Failed to fetch notifications by user ID');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const insertNotification = useCallback(async (trackingArea: string, token: string, body: InsertNotificationPayload) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.post(`/notifications/insert`, body), trackingArea);
			if (response.status !== 201) {
				console.log('Failed to insert notification', response.status);
				throw new Error('Failed to insert notification');
			}
			return response.data;
		}
		catch (error) {
			handleApiError(error);
		}
	}, []);

	const updateNotificationStatus = useCallback(async (trackingArea: string, token: string, notificationId: number, body: UpdateNotificationStatusPayload) => {
		try {
			const client = apiClientWithAuth(token); // Create an authenticated client
			const response = await trackPromise(client.put(`/notifications/update/${notificationId}`, body), trackingArea);
			if (response.status !== 201) {
				console.log('Failed to update notification status', response.status);
				throw new Error('Failed to update notification status');
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
		getFlightDetailsByPilotId,
		getAllPilots,
		getPilotById,
		updatePilotById,
		assignPilotToFlight,
		leaveRequest,
		updateLeaveRequest,
		getAllLeaveRequests,
		getLeaveRequestsByPilotId,
		getAllNotifications,
		getNotificationsByUserId,
		insertNotification,
		updateNotificationStatus,
	}
}