import moment from 'moment';
import { useEffect, useState } from 'react';

import { FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import Spinner from '../Spinner';

import pilotStyles from '../../../styles/pilotpage.module.css';

import { Box, Button, Modal, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useBackendActions } from '../../hooks/callBackend';
import isLoading from '../../hooks/isLoading';
import { useToast } from '../../hooks/useToast';
import { InsertNotificationPayload } from '../../models/requests-interface';
import { NotificationResponse, UserDetails } from '../../models/response-interface';
import { notificationTypes } from '../../utils/dropdownValues';

const toShowNotificationNoOfDays = 2;

const Notifications = () => {

	const { token, userId, role } = useAuth();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const { getNotificationsByUserId, getAllUsers, insertNotification, updateNotificationStatus } = useBackendActions();
	const { successToast, errorToast } = useToast();

	const [users, setUsers] = useState<UserDetails[]>([]);
	const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

	const [notificationType, setNotificationType] = useState<string>('');
	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [toAll, setToAll] = useState<boolean>(false);
	const [selectedUserId, setSelectedUserId] = useState<number>();

	const getAllUsersMethod = () => {
		if (!token) return;
		if (role === 'pilot') return;

		getAllUsers('users-area', token)
			.then((response: UserDetails[]) => {
				setUsers(response);
			})
			.catch((error: any) => {
				errorToast('Error fetching users. Please try again later.');
				setNotifications([]);
			});
	}

	const getNotifications = () => {
		if (!userId || !token) return;

		getNotificationsByUserId(userId, token, 'notifications-area')
			.then((response: NotificationResponse[]) => {
				const filteredNotifications = response.filter(notification => {
					return notification.status !== 'read' && moment(notification.created_at).isAfter(moment().subtract(toShowNotificationNoOfDays, 'days'));
				});
				setNotifications(filteredNotifications);
			})
			.catch((error: any) => {
				errorToast('Error fetching notifications. Please try again later.');
				setNotifications([]);
			});
	}

	const handleNotify = () => {
		if (!title || !description || !notificationType || !selectedUserId) {
			errorToast('Please fill out all fields.');
			return;
		}

		if (!token) return;
		if (role === 'pilot') return;
		if (!userId) return;

		const payload: InsertNotificationPayload = {
			title,
			message: description,
			type: notificationType,
			created_by: userId,
		};

		if (!toAll) {
			payload.recipient_id = selectedUserId; // Send to all users
		}

		insertNotification('insert-notifications-area', token, payload)
			.then(() => {
				setIsModalOpen(false);
				getNotifications();
			})
			.catch(() => {
				errorToast('Failed to send notification. Please try again.');
			}).finally(() => {
				setTitle('');
				setDescription('');
				setNotificationType('');
				setToAll(false);
				setSelectedUserId(undefined);
			});
	};


	const handleNotificationStatusUpdate = (notificationId: number) => {
		if (!token) return;
		
		updateNotificationStatus('update-notification-status-area', token, notificationId, { status: 'read' })
			.then((response) => {
				successToast('Notification status updated successfully!');
				getNotifications(); // Refresh notifications after updating status
			})
			.catch((error: any) => {
				errorToast('Error updating notification status. Please try again later.');
			});
	}

	useEffect(() => {
		getNotifications();
		if (role === 'admin') {
			getAllUsersMethod();
		}
	}, []);

	const isFetchingData = isLoading('notifications-area');
	const isUpdatingNotificationStatus = isLoading('update-notification-status-area');
	const isInsertingNotification = isLoading('insert-notifications-area');

	return (
		<div>
			{
				(isFetchingData || isUpdatingNotificationStatus || isInsertingNotification) && 
					<Spinner
						color='primary'
						size={60}
					/>
			}

			<div className={pilotStyles.notificationContainer}>
				<div className={pilotStyles.notificationHeader}>
					<Typography variant="h4" className={pilotStyles.dashboardTitle}>
						{'Notifications'}
					</Typography>
					{
						(role === 'admin') && (
							<Button
								variant="contained"
								color="primary"
								onClick={() => setIsModalOpen(true)}
								disabled={false}
							>
								{'Send Notification'}
							</Button>
						)
					}
				</div>

				<div className={pilotStyles.dashboardContent}>
					{
						notifications.length === 0 && !isFetchingData && (
							<div className={pilotStyles.noNotifications}>
								<p>No notifications available.</p>
							</div>
						)
					}
					{/* Map through notifications and render them with different styles based on status */}
					{
						notifications.map((notification) => {
							let backgroundColor = '#f9f9f9';
							let borderColor = '#ccc';

							switch (notification.type) {
								case 'INFO':
									backgroundColor = '#e7f5ff';
									borderColor = '#91d5ff';
									break;
								case 'ALERT':
									backgroundColor = '#fff1f0';
									borderColor = '#ff7875';
									break;
								case 'REMINDER':
									backgroundColor = '#f6ffed';
									borderColor = '#b7eb8f';
									break;
								default:
									break;
							}

							return (
								<div
									key={notification.notification_id}
									style={{
										border: `1px solid ${borderColor}`,
										borderRadius: '8px',
										padding: '16px',
										marginBottom: '12px',
										backgroundColor: backgroundColor,
										boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
										display: 'flex',
										justifyContent: 'space-between'
									}}
								>
									<div className="notificationContentDiv" style={{ maxWidth: '70%' }}>
										<h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{notification.title}</h3>
										<p style={{ margin: '0 0 4px 0', color: '#555' }}>{notification.message}</p>
										<span style={{ fontSize: '12px', color: '#888' }}>
											{moment(notification.created_at).format('MMMM Do YYYY, h:mm:ss a')}
										</span>
									</div>
									{
										(notification.recipient_id === Number(userId)) && (
											<div className="notificatioActionButtonDiv">
												<Button size='small' variant="contained" color={"info"} onClick={() => handleNotificationStatusUpdate(notification.notification_id)} disabled={isUpdatingNotificationStatus}>
													{'Mark As Read'}
												</Button>
											</div>
										)
									}
								</div>
							);
						})
					}
				</div>
			</div>

			{/* Modal for sending notifications */}
			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '60vw',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
					}}
				>
						<div>
							<FormControl fullWidth margin="normal">
								<InputLabel id="notification-type-label">Notification Type</InputLabel>
								<Select
									labelId="notification-type-label"
									value={notificationType}
									label="Notification Type"
									onChange={(e) => setNotificationType(e.target.value)}
								>	
									{
										notificationTypes.map((type, index) => (
											<MenuItem key={index} value={type.value}>
												{type.label}
											</MenuItem>
										))
									}
								</Select>
							</FormControl>

							<TextField
								fullWidth
								margin="normal"
								label="Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>

							<TextField
								fullWidth
								margin="normal"
								label="Description"
								multiline
								rows={4}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>

							<FormControlLabel
								control={
									<Switch
										checked={toAll}
										onChange={(e) => setToAll(e.target.checked)}
									/>
								}
								label="Send to all users"
							/>

							
							<FormControl fullWidth margin="normal">
								<InputLabel id="user-select-label">Select User</InputLabel>
								<Select
									disabled={toAll}
									labelId="user-select-label"
									value={toAll ? '' : selectedUserId || ''}
									onChange={(e) => setSelectedUserId(Number(e.target.value))}
								>
									{users.map((user) => (
										<MenuItem key={user.id} value={user.id}>
											{`${user.first_name} ${user.last_name}`}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Box display="flex" justifyContent="space-between" marginTop={2}>
								<Button variant="contained" color="primary" onClick={handleNotify}>
									Notify
								</Button>
								<Button variant="outlined" color="secondary" onClick={() => setIsModalOpen(false)}>
									Cancel
								</Button>
							</Box>
						</div>
				</Box>
			</Modal> 
		</div>
	)
}

export default Notifications