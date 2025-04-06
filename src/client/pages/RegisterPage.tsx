// src/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import registerStyles from '../../styles/register.module.css';

const RegisterPage = () => {
	const navigate = useNavigate();

	const [idNumber, setIdNumber] = useState('');
	const [password, setPassword] = useState('');

	const handleContinue = () => {
		// Insert any registration validation/logic here before navigating.
		navigate('/dashboard');
	};

	return (
		<div className={registerStyles.container}>

			{/* LEFT PANEL: Registration Form */}
			<div className={registerStyles.leftPanel}>
				<div className={registerStyles.contentWrapper}>
				<h1 className={registerStyles.logo}>Udaan</h1>
				<h2 className={registerStyles.registerHeading}>Register</h2>
				<p className={registerStyles.subtitle}>Please register via your email address</p>

				<div className={registerStyles.inputGroup}>
					<label className={registerStyles.label}>Enter your email address</label>
					<input
						type="text"
						className={registerStyles.input}
						placeholder="2149-XXXXX"
						value={idNumber}
						onChange={(e) => setIdNumber(e.target.value)}
					/>
				</div>

				<div className={registerStyles.inputGroup}>
					<label className={registerStyles.label}>Set Password</label>
					<input
						type="password"
						className={registerStyles.input}
						placeholder="********"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>

				<button
					onClick={handleContinue}
					disabled={!idNumber || !password}
				>
					Continue
				</button>

				<div className={registerStyles.loginLinkContainer}>
					<p>
					Already have an account?{' '}
					<a href="/login" className={registerStyles.loginLink}>
						Log in Instead
					</a>
					</p>
				</div>

				<div className={registerStyles.footer}>
					<p>© 2023 Udaan. All rights reserved.</p>
				</div>
				</div>
			</div>

			{/* RIGHT PANEL: Background Image */}
			<div className={registerStyles.rightPanel} />
		</div>
	);
};

export default RegisterPage;