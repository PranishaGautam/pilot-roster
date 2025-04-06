import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Link, Alert, TextField } from '@mui/material';
import Spinner from '../components/Spinner';

import paperPlanes from '../../assets/plane2.avif';
import registerStyles from '../../styles/register.module.css';

import { LOGIN_PAGE_LINK } from '../utils/constants';
import { useBackendActions } from '../hooks/callBackend';
import useLoading from '../hooks/isLoading';
import { useToast } from '../hooks/useToast';

const RegisterPage = () => {
	const navigate = useNavigate();
	const { register } = useBackendActions();
	const { successToast, errorToast } = useToast();

	// State variables for first name, last name, email, and password
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	const [errorType, setErrorType] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	// Memo to handle login button enable/disable
	const enableRegister: boolean = useMemo(() => {
		// Check if email and password are provided
		return email.length > 0 && password.length > 0 && firstName.length > 0 && lastName.length > 0;
	}, [email, password]);

	const handleRegister = async () => {
		const defaultRegisterRole = 'pilot';
		
		try {
			const payload = JSON.stringify({ first_name: firstName, last_name: lastName,  email, password, role: defaultRegisterRole });
			// Call the register API
			const registerResponse = await register(payload, 'register-area');

			if (registerResponse) {
				// Handle successful registration
				successToast('Registration successful! Navigating to login page...');
				await new Promise(resolve => setTimeout(resolve, 2000));
				navigate(LOGIN_PAGE_LINK); // Redirect to login page
			}
		} catch (error: any) {
			console.log('Registration error:', error);
			setErrorType(error.type); // Reset error type
			setErrorMessage(error.message); // Reset error message
			errorToast(error.message);
		}
		
	};

	const isRegistering = useLoading('register-area');

	// Hanldler to handle navigation to the provided page
	const handleNavigate = (link: string) => {
		navigate(link);
	}

	return (
		<div className={registerStyles.container}>
			{/* LOADING SPINNER */}
			{isRegistering && <Spinner />}

			{/* LEFT PANEL: Registration Form */}
			<div className={registerStyles.leftPanel}>
				<div className={registerStyles.contentWrapper}>
				<h1 className={registerStyles.logo}>Udaan</h1>
				<h2 className={registerStyles.registerHeading}>Register</h2>
				<p className={registerStyles.subtitle}>Please register via your email address</p>

				<div className={registerStyles.inputGroup}>
					<TextField
						required
						id="fname-input"
						label="First Name"
						placeholder='Enter your first name'
						type='text'
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						disabled={isRegistering ? true : false}
					/>
				</div>

				<div className={registerStyles.inputGroup}>
					<TextField
						required
						id="lname-input"
						label="Last Name"
						placeholder='Enter your last name'
						type='text'
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						disabled={isRegistering ? true : false}
					/>
				</div>

				<div className={registerStyles.inputGroup}>
					<TextField
						required
						id="email-input"
						label="Email Address"
						placeholder='Enter your email address'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isRegistering ? true : false}
					/>
				</div>

				<div className={registerStyles.inputGroup}>
					<TextField
						required
						id="password-input"
						label="Password"
						placeholder='Enter your password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isRegistering ? true : false}
					/>
				</div>

				<div className="errorDiv">
					{
						errorMessage && 
						<Alert severity="error">{errorMessage}</Alert>
					}
				</div>

				<Button variant='contained' disabled={!enableRegister} onClick={handleRegister}>{'Register account'}</Button>

				<div className={registerStyles.loginLinkContainer}>
					<p>
						Already have an account?{' '}
						<Link 
							component="button" 
							underline="hover" 
							onClick={() => handleNavigate(LOGIN_PAGE_LINK)} 
							variant='body2' 
							color="primary">
							{'Log in instead'}
						</Link>
					</p>
				</div>

				<div className={registerStyles.footer}>
					<p>© 2023 Udaan. All rights reserved.</p>
				</div>
				</div>
			</div>

			{/* RIGHT PANEL: Background Image */}
			<div className={registerStyles.rightPanel}>
				<img 
					src={paperPlanes} 
					alt="Login Image" 
					className={registerStyles.image}
				/>
			</div>
		</div>
	);
};

export default RegisterPage;