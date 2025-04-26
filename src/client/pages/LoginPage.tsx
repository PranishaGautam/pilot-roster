import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import { Alert, Button, InputAdornment, Link, TextField } from '@mui/material';
import Spinner from '../components/Spinner';

import planeImage from '../../assets/plane1.jpg';
import loginstyles from '../../styles/login.module.css';

import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import isLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';

import { LoginResponse } from '../models/response-interface';
import { emailRegex, REGISTER_PAGE_LINK } from '../utils/constants';

const LoginPage = () => {

	const navigate = useNavigate();
	const { login } = useBackendActions();
	const { successToast, errorToast } = useToast();

	// Access the authentication context
	const { setToken, setRole, setPilotId, setUserId } = useAuth();

	// State variables for email and password
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [errorType, setErrorType] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	// Memo to handle login button enable/disable
	const enableLoginButton: boolean = useMemo(() => {
		// Check if email and password are provided
		return email.length > 0 && password.length > 0;
	}, [email, password]);

	// Handler to handle login functionality
	const handleLogin = async () => {

		// Validating email format
		if (!emailRegex.test(email)) {
			setErrorType('INVALID_EMAIL_TYPE');
			setErrorMessage('Invalid email format. Please enter a valid email address.');
			errorToast('Invalid email format. Please enter a valid email address.');
			return;
		}

		setErrorType(''); // Reset error type
		setErrorMessage(''); // Reset error message

		try {
			const payload = JSON.stringify({email, password});
			const loginResponse = await login(payload, 'login-area');

			if (loginResponse) {
				const loginResponseData = loginResponse as LoginResponse;
				setToken(loginResponseData.token); // Set the token in the context
				setRole(loginResponseData.role); // Set the role in the context
				if (loginResponseData.role === 'pilot') {
					setPilotId(loginResponseData.pilot_id); // Set the pilot ID in the context
					setUserId(loginResponseData.user_id);
				} else if (loginResponseData.role === 'admin') {
					setPilotId(null); // Set the pilot ID to null for admin
					setUserId(loginResponseData.user_id); // Set the user ID in the context
				}
				
				if (loginResponseData.role === 'admin') {
					successToast('Login successful!');
					await new Promise(resolve => setTimeout(resolve, 2000));
					navigate('/dashboard'); // Redirect to admin dashboard
				}
				else if (loginResponseData.role === 'pilot') {
					successToast('Login successful! Welcome aboard!');
					await new Promise(resolve => setTimeout(resolve, 2000));
					navigate('/pilot'); // Redirect to user dashboard
				}
			}

		} catch (error: any) {
			console.log('Login error:', error);
			// Handle error (e.g., show error message)
			if (error.type === 'USER_NOT_FOUND') {
				setErrorType(error.type);
				setErrorMessage(error.message);
			} else if (error.type === 'INVALID_CREDENTIALS') {
				setErrorType(error.type);
				setErrorMessage(error.message);
			} else if (error.type === 'NETWORK_ERROR') {
				setErrorType(error.type);
				setErrorMessage(error.message);
			} else {
				setErrorMessage('An unexpected error occurred. Please refresh and try again.');
			}
			errorToast(error.message);
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
					<TextField
						required
						id="email-input"
						label="Email"
						placeholder='Enter your email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={['USER_NOT_FOUND', 'INVALID_CREDENTIALS', 'INVALID_EMAIL_TYPE'].includes(errorType) ? true : false}
						color={['INVALID_CREDENTIALS'].includes(errorType) ? 'error' : 'primary'}
						disabled={isLoggingIn ? true : false}
						// helperText={email.length === 0 ? 'Email is required' : ''}
						slotProps={{
							input: {
							  startAdornment: (
								<InputAdornment position="start">
							  		<MailOutlinedIcon />
								</InputAdornment>
							  ),
							},
						}}
					/>
				</div>

				<div className={loginstyles.inputGroup}>
					<TextField
						required
						id="password-input"
						label="Password"
						placeholder='Enter your password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						error={['INVALID_CREDENTIALS'].includes(errorType) ? true : false}
						color={['INVALID_CREDENTIALS'].includes(errorType) ? 'error' : 'primary'}
						disabled={isLoggingIn ? true : false}
						slotProps={{
							input: {
							  startAdornment: (
								<InputAdornment position="start">
							  		<PasswordOutlinedIcon />
								</InputAdornment>
							  ),
							},
						}}
					/>
				</div>

				<div className="errorDiv">
					{
						errorMessage && 
						<Alert severity="error">{errorMessage}</Alert>
					}
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
				<img 
					src={planeImage} 
					alt="Login Image" 
					className={loginstyles.image}
				/>
			</div>
		</div>
	);
};

export default LoginPage;
