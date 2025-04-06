import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import { useCallback } from 'react';

import { 
	LoginPayload, LoginResponse, LoginError,
	RegisterPayload, RegisterResponse, 
	UserDetails
} from '../models/response.interface';

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
const apiClientWithAuth = () => {
	const { token } = useAuth(); // Access the token from the AuthContext
  
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
	getUserDetailById: (userId: string, trackingArea: string) => Promise<UserDetails>;
	getAllUsers: (trackingArea: string) => Promise<Array<UserDetails>>;
}

export function useBackendActions(): useBackendActionsReturn {

	// Function to handle login
	// The function takes a tracking area and a payload as arguments
	const login = useCallback(async (payload: string, trackingArea: string) => {
		try {
			const response = await trackPromise(apiClient.post(`/login`, payload), trackingArea);
			if (response.status === 404) {
				console.log('User not found', response);
				throw { type: 'USER_NOT_FOUND', message: 'User not found. Please check your credentials.' };
			}

			if (response.status === 401) {
				console.log('Invalid credentials', response);
				throw { type: 'INVALID_CREDENTIALS', message: 'Invalid credentials. Please try again.' };
			}

			if (response.status !== 200) {
				throw new Error('Login failed');
			}
			console.log('Login successful', response);
			return response.data as LoginResponse;
		} catch (error) {
			handleApiError(error);
			throw { type: 'NETWORK_ERROR', message: 'Network error. Please try again later.' };
		}
	}, []);


	// Function to handle registration
	// The function takes a tracking area and a payload as arguments
	const register = useCallback(async (payload: string, trackingArea: string) => {
		try {
			const response = await trackPromise(apiClient.post(`/register`, payload), trackingArea);
			if (response.status !== 200) {
				console.log('Registration failed', response.status);
				throw new Error('Registration failed');
			}
			return response.data;
		} catch (error) {
			handleApiError(error);
		}
		
	}, []);

	// Function to fetch user details by ID
	const getUserDetailById = useCallback(async (userId: string, trackingArea: string) => {
		try {
			const client = apiClientWithAuth(); // Create an authenticated client
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

	const getAllUsers = useCallback(async (trackingArea: string) => {
		try {	
			const client = apiClientWithAuth(); // Create an authenticated client
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

	return {
		login,
		register,
		getUserDetailById,
		getAllUsers
	}

}