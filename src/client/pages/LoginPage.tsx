import React, { useState } from 'react';

import loginstyles from '../../styles/login.module.css';

const LoginPage = () => {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		console.log('Email:', email);
		console.log('Password:', password);	
	}

	return (
		<div className={loginstyles.container}>
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

			<button className={loginstyles.loginButton} onClick={handleLogin}>
				Login
			</button>
			</div>
		</div>

		<div className={loginstyles.rightPanel} />

		</div>
	);
};

export default LoginPage;
