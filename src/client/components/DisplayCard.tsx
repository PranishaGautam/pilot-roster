import React, { useState, useMemo } from 'react';
import _ from 'lodash';
import moment from 'moment';

import dashboardStyles from '../../styles/dashboard.module.css';

import { TIME_FORMAT } from '../utils/constants';

interface Props {
	cardTitle: string;
	cardValue: string | number;
	percentageIndicator: string;
	percentageChange: string;
	cardDate: string;
}

const DisplayCard = ({ cardTitle, cardValue, percentageIndicator, percentageChange, cardDate }: Props) => {

	// Format the cardDate using moment
    const formattedCardDate = moment(cardDate, TIME_FORMAT).format('MMMM D, YYYY');

	 // Format the cardValue and percentageChange using Intl.NumberFormat
	 const formattedCardValue = new Intl.NumberFormat('en-US').format(_.toNumber(cardValue));
	 const formattedPercentageChange = new Intl.NumberFormat('en-US').format(_.toNumber(percentageChange));
 
	return (
		<div className={dashboardStyles.activityCard}>
			<h3 className={dashboardStyles.activityCardTitle}>{cardTitle}</h3>
			<p className={dashboardStyles.activityCardValue}>
				{formattedCardValue} 
				<span 
					className={
                        percentageIndicator === 'positive'
                            ? dashboardStyles.upIndicator
                            : dashboardStyles.downIndicator
                    }
				>
					{percentageIndicator === 'positive' ? '↑' : '↓'} {formattedPercentageChange}%
				</span>
			</p>
			<p className={dashboardStyles.activityCardDate}>From {formattedCardDate}</p>
		</div>
	)
}

export default DisplayCard