import React from 'react';
import {Box, Text} from 'ink';
import {MIN_COLUMNS, MIN_ROWS} from '../constants/game.js';

export function ScreenError({stdout}) {
	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="single"
			borderColor="red"
		>
			<Text color="red" bold>
				❗ Screen too small
			</Text>
			<Text>
				Please resize your terminal to at least {MIN_COLUMNS}x{MIN_ROWS}.
			</Text>
			<Text dimColor>
				Current: {stdout.columns}x{stdout.rows}
			</Text>
			<Text marginTop={1}>Press 'q' to quit.</Text>
		</Box>
	);
}
