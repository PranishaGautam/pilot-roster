import { useMemo, useState } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { useNavigate } from 'react-router-dom';

import { Link, Button } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Spinner from '../components/Spinner';

import loginstyles from '../../styles/login.module.css';

import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';

import { REGISTER_PAGE_LINK } from '../utils/constants';
import { LoginError, LoginResponse } from '../models/response.interface';

const LoginPage = () => {

	const navigate = useNavigate();
	const { login } = useBackendActions();

	// Access the authentication context
	const { setToken, setRole } = useAuth();

	// State variables for email and password
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	// Memo to handle login button enable/disable
	const enableLoginButton: boolean = useMemo(() => {
		// Check if email and password are provided
		return email.length > 0 && password.length > 0;
	}, [email, password]);

	// Handler to handle login functionality
	const handleLogin = async () => {
		try {
			const payload = JSON.stringify({email, password});
			const loginResponse = await login(payload, 'login-area');

			if (loginResponse) {
				const loginResponseData = loginResponse as LoginResponse;
				setToken(loginResponseData.token); // Set the token in the context
				setRole(loginResponseData.role); // Set the role in the context
				
				if (loginResponseData.role === 'admin') {
					navigate('/dashboard'); // Redirect to admin dashboard
				}
				else if (loginResponseData.role === 'pilot') {
					navigate('/pilot'); // Redirect to user dashboard
				}
			}

		} catch (error: any) {
			console.log('Login error:', error);
			// Handle error (e.g., show error message)
			if (error.type === 'USER_NOT_FOUND') {
				setError(error.message);
			} else if (error.type === 'INVALID_CREDENTIALS') {
				setError(error.message);
			} else if (error.type === 'NETWORK_ERROR') {
				setError(error.message);
			} else {
				setError('An unexpected error occurred. Please refresh and try again.');
			}
		}
	}

	const isLoggingIn = isLoading('login-area');

	// Hanldler to handle navigation to the provided page
	const handleNavigate = (link: string) => {
		navigate(link);
	}

	return (
		<div className={loginstyles.container}>
			{
				isLoggingIn && 
					<Spinner
						color='primary'
						size={60}
					/>
			}
			
			{/* LEFT PANEL: Login Form */}
			<div className={loginstyles.leftPanel}>
				<div className={loginstyles.logoContainer}>
					<h1 className={loginstyles.logo}>Udaan</h1>
				</div>

				<div className={loginstyles.formContainer}>
				<h2 className={loginstyles.loginHeading}>Login</h2>

				<div className={loginstyles.inputGroup}>
					<label className={loginstyles.label}>Email</label>
					<input
						type="email"
						className={loginstyles.input}
						placeholder="Enter your email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>

				<div className={loginstyles.inputGroup}>
					<label className={loginstyles.label}>Password</label>
					<input
						type="password"
						className={loginstyles.input}
						placeholder="Enter your password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<div className="errorDiv">
					{error && <p className={loginstyles.errorText}>{error}</p>}
				</div>

				<Button variant='contained' disabled={!enableLoginButton} onClick={handleLogin}>{'Login'}</Button>

				<div className={loginstyles.registerPrompt}>
					<p className={loginstyles.promptText}>First time user?</p>
					<Link 
						component="button" 
						underline="hover" 
						onClick={() => handleNavigate(REGISTER_PAGE_LINK)} 
						variant='body2' 
						color="primary">
						{'Register here'}
					</Link>
				</div>
				</div>
			</div>

			{/* RIGHT PANEL: Icon */}
			<div className={loginstyles.rightPanel}>
				<FlightTakeoffIcon className={loginstyles.flyingImage} />
			</div>
		</div>
	);
};

export default LoginPage;
