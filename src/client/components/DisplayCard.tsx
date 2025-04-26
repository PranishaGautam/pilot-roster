import _ from 'lodash';
import moment from 'moment';

import dashboardStyles from '../../styles/dashboard.module.css';

import { TIME_FORMAT } from '../utils/constants';

interface Props {
	cardTitle: string;
	cardValue: number | string;
	percentageIndicator?: string;
	percentageChange?: string;
	cardDate?: string;
	content?: React.ReactNode;
}

const DisplayCard = ({ cardTitle, cardValue, percentageIndicator, percentageChange, cardDate, content }: Props) => {

	// Format the cardDate using moment
    const formattedCardDate = moment(cardDate, TIME_FORMAT).format('MMMM D, YYYY');

	let formattedCardValue = cardValue;
	// Format the cardValue and percentageChange using Intl.NumberFormat
	if (typeof cardValue === 'number') {
		formattedCardValue = new Intl.NumberFormat('en-US').format(_.toNumber(cardValue));
	} else {
		formattedCardValue = cardValue;
	}
	 
	const formattedPercentageChange = new Intl.NumberFormat('en-US').format(_.toNumber(percentageChange));
 
	return (
		<div className={`${dashboardStyles.activityCard}`}>
			<h3 className={dashboardStyles.activityCardTitle}>{cardTitle}</h3>
			<p className={dashboardStyles.activityCardValue}>
				{formattedCardValue} 
				{
					(percentageIndicator && percentageChange) && (
						<span 
							className={
								percentageIndicator === 'positive'
									? dashboardStyles.upIndicator
									: dashboardStyles.downIndicator
							}
						>
							{percentageIndicator === 'positive' ? '↑' : '↓'} {formattedPercentageChange}%
						</span>
					)
				}
			</p>
			{
				cardDate && (
					<p className={dashboardStyles.activityCardDate}>From {formattedCardDate}</p>
				)
			}
			{
				content && (
					<div className={dashboardStyles.activityCardContent}>
						{content}
					</div>
				)
			}
		</div>
	)
}

export default DisplayCard