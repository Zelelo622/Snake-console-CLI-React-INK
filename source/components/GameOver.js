import React from 'react';
import {Box, Text} from 'ink';

export function GameOver({score}) {
	return (
		<Box flexDirection="column" alignItems="center">
			<Text color="red" bold>
				💥 GAME OVER 💥
			</Text>
			<Text>Final Score: {score}</Text>
			<Box flexDirection="column" alignItems="center" marginTop={1}>
				<Text inverted color="yellow">
					{' '}
					Press 'r' to Restart{' '}
				</Text>
				<Text>
					{' '}
					Press <Text color="red">q</Text> to Quit{' '}
				</Text>
			</Box>
		</Box>
	);
}
