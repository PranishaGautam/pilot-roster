import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash'

import dashboardStyles from '../../styles/dashboard.module.css';
import { useAuth } from '../context/AuthContext';
import { useBackendActions } from '../hooks/callBackend';
import { UserDetails } from '../models/response-interface';

const TopNavBar = () => {

	const { token, userId } = useAuth();

	const { getUserDetailById } = useBackendActions();

	const [userDetails, setUserDetails] = useState<UserDetails>();
	
	useEffect(() => {
		if (userId && token) {
			getUserDetailById(userId, token, 'get-user-detail')
			.then((response) => {
				console.log('User Details:', response);
				if (response) {
					setUserDetails(response);
				}
			}).catch((error) => {
				console.error('Error fetching user details:', error);
			});
		}
	}, []);

	const fullName: string = useMemo(() => {
		if (userDetails) {
			return `${_.startCase(userDetails.first_name)} ${_.startCase(userDetails.last_name)}`;
		}
		return '';
	}, [userDetails]);

	return (
		<div className={dashboardStyles.topBar}>
			{/* <h1 className={dashboardStyles.pageTitle}>Himalaya Airlines</h1> */}
			<div className={dashboardStyles.topUserInfo}>
				{
					fullName && (
						<span className={dashboardStyles.userCircle}>
							{userDetails && _.startCase(fullName).split(' ').map(word => word[0]).join('')}
						</span>
					)
				}
				<span style={{ marginLeft: 8 }}>{fullName}</span>
			</div>
		</div>
	)
}

export default TopNavBar;