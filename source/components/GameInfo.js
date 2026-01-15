import React from 'react';
import {Box, Text} from 'ink';

export function GameInfo({score, speedLevel, highScore}) {
	return (
		<Box marginY={1}>
			<Box marginRight={2}>
				<Text>Score: </Text>
				<Text color="yellow" bold>
					{score}
				</Text>
				<Text> | </Text>
				<Text>High Score: </Text>
				<Text color="yellowBright" bold>
					{highScore}
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
