import React, {useEffect} from 'react';
import {Box, Text} from 'ink';

export function Notification({achievement, onFinished}) {
	useEffect(() => {
		if (!achievement) return;

		const timer = setTimeout(() => {
			onFinished();
		}, 4000);

		return () => clearTimeout(timer);
	}, [achievement]);

	return (
		<Box
			marginTop={1}
			borderStyle="round"
			borderColor="yellow"
			paddingX={1}
			flexDirection="column"
		>
			<Box>
				<Text color="yellow" bold>
					🏆 ACHIEVEMENT UNLOCKED!{' '}
				</Text>
			</Box>
			<Box>
				<Text color="white" bold>
					{achievement.name}
				</Text>
				<Text dimColor> — {achievement.description}</Text>
			</Box>
		</Box>
	);
}
