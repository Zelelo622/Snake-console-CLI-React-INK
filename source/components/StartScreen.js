import React from 'react';
import {Box, Text} from 'ink';
import {Header} from './Header.js';

export function StartScreen() {
	return (
		<Box flexDirection="column" alignItems="center" padding={1}>
			<Header />
			<Text bold color="yellow">
				Welcome to Snake!
			</Text>
			<Box marginTop={1}>
				<Text inverted color="green">
					{' '}
					PRESS ENTER TO START{' '}
				</Text>
			</Box>
			<Text dimColor>Use Arrow Keys to move</Text>
		</Box>
	);
}
