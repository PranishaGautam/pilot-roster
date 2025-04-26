import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Divider, Modal, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

import Spinner from '../Spinner';

import pilotStyles from '../../../styles/pilotpage.module.css';

import { useAuth } from '../../context/AuthContext';
import { useBackendActions } from '../../hooks/callBackend';
import isLoading from '../../hooks/isLoading';
import { useToast } from '../../hooks/useToast';
import { RequestLeavePayload } from '../../models/requests-interface';
import { PilotRequests } from '../../models/response-interface';

const Requests = () => {

	const { token, userId, role, pilotId } = useAuth();
	
	const { leaveRequest, getLeaveRequestsByPilotId } = useBackendActions();
	const { successToast, errorToast } = useToast();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const [requests, setRequests] = useState<Array<PilotRequests>>([]);

	const [description, setDescription] = useState('');
	const [startDate, setStartDate] = useState<Dayjs | null>(null); // If needed to add a particular date, for the day , replace null with dayjs().startOf('day')
	const [endDate, setEndDate] = useState<Dayjs | null>(null); // If needed to add a particular date, for the day , replace null with dayjs().add(1, 'day').startOf('day')
	

	const isButtonDisabled: boolean = useMemo(() => {
		if (!description || description.trim().length === 0 || !startDate || !endDate) {
			return true;
		} else {
			return false;
		}
	}, [description, startDate, endDate]);

	const handleCloseModal = () => {
		setDescription('');
		setStartDate(null);
		setEndDate(null);
		setIsModalOpen(false);
	};

	const handleSubmitRequest = () => {
		if (!token || !pilotId || !startDate || !endDate) return;

		const requestPayload: RequestLeavePayload = {
			requestor_id: pilotId,
			request_type: "LEAVE",
			request_description: description,
			start_time: startDate?.toISOString(),
			end_time: endDate?.toISOString(),
			status: 'PENDING',
		}

		leaveRequest('submit-request-area', token, requestPayload)
			.then((response) => {
				successToast('Leave request submitted successfully!');
				setIsModalOpen(false);
				getAllRequestForPilot();
			})
			.catch((error: any) => {
				errorToast('Error submitting leave request. Please try again later.');
			}
		);
	}

	const getAllRequestForPilot = () => {
		if (!pilotId || !token) return;
		getLeaveRequestsByPilotId('requests-area', token, pilotId)
			.then((response) => {
				setRequests(response);
			})
			.catch((error: any) => {
				console.log(error);
			})
	}

	useEffect(() => {
		getAllRequestForPilot();
	}, []);

	const isFetchingData = isLoading('requests-area');
	
	return (
		<>
			{
				isFetchingData && 
					<Spinner
						color='primary'
						size={60}
					/>
			}
			<div className={pilotStyles.dashboardContainer}>
				<div className={pilotStyles.requestHeader}>
					<div className={pilotStyles.requestHeaderTitle}>
						<Typography variant="h5" className={pilotStyles.dashboardTitle}>
							{'Requests'}
						</Typography>
					</div>
					<div className={pilotStyles.buttonDiv}>
						<Button variant='contained' disabled={false} onClick={() => setIsModalOpen(true)}>{'Request Leave'}</Button>
					</div>
				</div>

				<Divider></Divider>

				<div className={pilotStyles.requestsDiv}>
					{
						requests.length > 0 ? (
							<>
								{
									requests.map((request: PilotRequests) => {
										return (
											<div
												key={request.request_id}
												className={pilotStyles.requestDisplayDiv}
											>
												<div className={pilotStyles.requestContentDiv}>
													<div className={pilotStyles.requestTopDiv}>
														<Typography variant="body1">{`Request Type: ${request.request_type}`}</Typography>
														<Typography variant="body1">{`Start Date: ${moment(request.start_time).format('DD/MM/YYYY')}`}</Typography>
														<Typography variant="body1">{`End Date: ${moment(request.end_time).format('DD/MM/YYYY')}`}</Typography>
													</div>
													<div className={pilotStyles.requestBottomDiv}>
														<Typography>{`Description: ${request.request_description}`}</Typography>
													</div>
												</div>
												
												<Typography
													variant="body2"
													style={{
														color: request.status === 'APPROVED' ? 'green' : request.status === 'REJECTED' ? 'red' : 'orange',
														fontWeight: 'bold',
													}}
												>
													{request.status}
												</Typography>
											</div>
										)
									})
								}
							</>
						) : (
							<Typography variant="h6" className={pilotStyles.noRequests}>
								{'No requests found.'}
							</Typography>
						)
					}
				</div>
			</div>
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '40vw',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
					<Typography variant="h6" component="h2" sx={{ mb: 2 }}>
						Please enter all required fields
					</Typography>

					<Box className={pilotStyles.requestForm}>
						<TextField
							label="Description"
							variant="outlined"
							fullWidth
							multiline
							rows={4}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<div className={pilotStyles.dateRow}>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
								<DatePicker
									label="Start Date"
									value={startDate}
									onChange={(newValue) => setStartDate(newValue)}
								/>

								<DatePicker
									label="End Date"
									value={endDate}
									onChange={(newValue) => setEndDate(newValue)}
								/>
							</LocalizationProvider>
						</div>
					</Box>
					
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
						<Button onClick={handleCloseModal} sx={{ mr: 2 }}>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmitRequest}
							disabled={isButtonDisabled}
						>
							{'Submit request'}
						</Button>
					</Box>
				</Box>
			</Modal>
		</>
	)
}

export default Requests