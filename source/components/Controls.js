import React from 'react';
import {Box, Text} from 'ink';

export function Controls() {
	return (
		<Box marginTop={1} flexDirection="column" alignItems="center">
			<Text dimColor>----------------------------</Text>

			<Text>
				Speed: <Text color="blue">1</Text>-Slow | <Text color="blue">2</Text>
				-Mid | <Text color="blue">3</Text>-Fast
			</Text>

			<Text>
				Use{' '}
				<Text color="magenta" bold>
					Arrow Keys
				</Text>{' '}
				to Move
			</Text>

			<Box>
				<Text>
					Press <Text color="red">q</Text> to Quit
				</Text>
				<Text> | </Text>
				<Text>
					Press <Text color="green">r</Text> to Reset
				</Text>
			</Box>
		</Box>
	);
}
