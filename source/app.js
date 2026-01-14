import React from 'react';
import {Text, Box, useApp} from 'ink';

const FIELD_SIZE = 16;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

export default function App() {
	const {exit} = useApp();

	return (
		<Box flexDirection="column" alignItems="center">
			<Text color="cyan" bold>
				Snake CLI 🐍
			</Text>
			<Box flexDirection="column">
				{FIELD_ROW.map(y => (
					<Box key={y}>
						{FIELD_ROW.map(x => (
							<Text key={x}> . </Text>
						))}
					</Box>
				))}
			</Box>
		</Box>
	);
}
