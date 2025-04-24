import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import _ from 'lodash';

import Spinner from '../Spinner';

import pilotStyles from '../../../styles/pilotpage.module.css';

import { useAuth } from '../../context/AuthContext';
import isLoading from '../../hooks/isLoading';
import { useBackendActions } from '../../hooks/callBackend';
import { NotificationResponse } from '../../models/response-interface';
import { useToast } from '../../hooks/useToast';
import { Typography } from '@mui/material';


const Notifications = () => {

	const { token, userId, role, pilotId } = useAuth();

	const { getNotificationsByUserId } = useBackendActions();
	const { errorToast } = useToast();

	const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

	const getNotifications = () => {
		if (!userId || !token) return;

		getNotificationsByUserId(userId, token, 'notifications-area')
			.then((response: NotificationResponse[]) => {
				setNotifications(response);
			})
			.catch((error: any) => {
				errorToast('Error fetching notifications. Please try again later.');
				setNotifications([]);
			});
	}

	useEffect(() => {
		getNotifications();
	}, []);

	const isFetchingData = isLoading('notifications-area');

	return (
		<div>
			{
				isFetchingData && 
					<Spinner
						color='primary'
						size={60}
					/>
			}
			<div className={pilotStyles.notificationContainer}>
				<div className={pilotStyles.notificationHeader}>
					<Typography variant="h4" className={pilotStyles.dashboardTitle}>
						Notifications
					</Typography>
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
									}}
								>
									<h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{notification.title}</h3>
									<p style={{ margin: '0 0 4px 0', color: '#555' }}>{notification.message}</p>
									<span style={{ fontSize: '12px', color: '#888' }}>
										{moment(notification.created_at).format('MMMM Do YYYY, h:mm:ss a')}
									</span>
								</div>
							);
						})
					}
				</div>
			</div>
		</div>
	)
}

export default Notifications