import React from 'react';
import {Box, Text} from 'ink';

export function GameOver({score, highScore}) {
	return (
		<Box marginY={1} flexDirection="column" alignItems="center">
			<Text color="red" bold>
				💥 GAME OVER 💥
			</Text>
			<Text>Final Score: {score}</Text>
			{score >= highScore && score > 0 ? (
				<Text color="yellow">NEW RECORD! 🏆</Text>
			) : (
				<Text color="gray">Best: {highScore}</Text>
			)}
			<Box flexDirection="column" alignItems="center" marginTop={1}>
				<Text inverted color="yellow">
					Press 'r' to Restart
				</Text>
				<Text>
					Press <Text color="magenta">m</Text> Return to Menu
				</Text>
				<Text>
					Press <Text color="red">q</Text> to Quit
				</Text>
			</Box>
		</Box>
	);
}
