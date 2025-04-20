import React, { useState } from 'react';
import moment from 'moment';

import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { RequestLeavePayload } from '../models/requests-interface';
import isLoading from '../hooks/isLoading';
import Spinner from './Spinner';

const RequestLeaveForm: React.FC = () => {

	const navigate = useNavigate();
	
	const { token, role, pilotId } = useAuth();
	const { successToast, errorToast } = useToast();
	const { leaveRequest } = useBackendActions();
  
	const [form, setForm] = useState({
		pilotName: '',
		pilotId: '',
		leaveType: 'Annual',
		startDate: '',
		endDate: '',
		reason: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		// Handle other input changes
		setForm(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!pilotId || !token) {
			errorToast('Pilot ID or token is missing. Please log in again.');
			navigate('/');
			return;
		}

		const requestPayload: RequestLeavePayload = {
			requestor_id: pilotId,
			request_type: form.leaveType,
			request_description: form.reason,
			start_time: moment(form.startDate).toISOString(),
			end_time: moment(form.startDate).toISOString(),
			status: 'PENDING',
		}


		leaveRequest('submit-leave-request', token, role)
			.then(() => {
				successToast('Leave request submitted successfully!');
				navigate('/pilot');
			})
			.catch((error) => {
				errorToast(`Error submitting leave request: ${error.message}`);
			});
	};

	const isSubmitting = isLoading('submit-leave-request');

	return (
		<>
			{
				isSubmitting && 
					<Spinner
						color='primary'
						size={60}
					/>
			}
			<div style={styles.container}>
			<h2 style={styles.title}>Request Leave</h2>
			<form onSubmit={handleSubmit} style={styles.form}>
				<input type="text" name="pilotName" placeholder="Pilot Name" value={form.pilotName} onChange={handleChange} style={styles.input} required />
				<input type="text" name="pilotId" placeholder="Pilot ID" value={form.pilotId} onChange={handleChange} style={styles.input} required />

				<label style={styles.label}>Leave Type:</label>
				<select name="leaveType" value={form.leaveType} onChange={handleChange} style={styles.input}>
				<option value="Leave">Annual Leave</option>
				<option value="Leave">Sick Leave</option>
				<option value="Leave">Emergency Leave</option>
				</select>

				<label style={styles.label}>From Date:</label>
				<input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={styles.input} required />

				<label style={styles.label}>To Date:</label>
				<input type="date" name="endDate" value={form.endDate} onChange={handleChange} style={styles.input} required />

				<textarea name="reason" placeholder="Reason for Leave" value={form.reason} onChange={handleChange} style={styles.textarea} required />

				<button type="submit" style={styles.button} onClick={handleSubmit}>Submit Request</button>
			</form>
			</div>
		</>
	);
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#fef7e0',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#9c7300',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  label: {
    fontWeight: 500,
    marginTop: '0.5rem',
  },
  textarea: {
    padding: '0.8rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minHeight: '100px',
  },
  button: {
    marginTop: '1rem',
    padding: '0.9rem',
    backgroundColor: '#f4b400',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default RequestLeaveForm;