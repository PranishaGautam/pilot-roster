import React from 'react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[200],
		...theme.applyStyles?.('dark', {
			backgroundColor: theme.palette.grey[800],
		}),
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: '#1a90ff',
		...theme.applyStyles?.('dark', {
			backgroundColor: '#308fe8',
		}),
	},
}));

interface PerformanceBarProps {
	value: number;
}

const PerformanceBar: React.FC<PerformanceBarProps> = ({ value }) => {

	return (
		<BorderLinearProgress
			variant="determinate"
			value={value}
		/>
	);
};

export default PerformanceBar;