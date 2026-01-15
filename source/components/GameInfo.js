import React from 'react';
import {Box, Text} from 'ink';

export function GameInfo({score, speedLevel}) {
	return (
		<Box marginY={1}>
			<Box marginRight={2}>
				<Text>Score: </Text>
				<Text color="yellow" bold>
					{score}
				</Text>
			</Box>
			<Box>
				<Text>Speed: </Text>
				<Text color="magenta" bold>
					{speedLevel}
				</Text>
			</Box>
		</Box>
	);
}
