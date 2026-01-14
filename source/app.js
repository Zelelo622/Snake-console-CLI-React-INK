import React, {useState} from 'react';
import {Text, Box, useApp} from 'ink';

const FIELD_SIZE = 16;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

const foodItem = {
	x: Math.round(Math.random() * FIELD_SIZE),
	y: Math.round(Math.random() * FIELD_SIZE),
};

function getItem(x, y, snakeSegments) {
	if (x === foodItem.x && y === foodItem.y) {
		return <Text>🍎 </Text>;
	}

	for (const segment of snakeSegments) {
		if (x === segment.x && y === segment.y) {
			return <Text color="green"> ◼ </Text>;
		}
	}
}

export default function App() {
	const {exit} = useApp();
	const [snakeSegments, setSnakeSegments] = useState([
		{x: 8, y: 8},
		{x: 8, y: 7},
		{x: 8, y: 6},
	]);

	return (
		<Box flexDirection="column" alignItems="center">
			<Text color="cyan" bold>
				Snake CLI 🐍
			</Text>
			<Box flexDirection="column">
				{FIELD_ROW.map(y => (
					<Box key={y}>
						{FIELD_ROW.map(x => (
							<Text key={x}>{getItem(x, y, snakeSegments) || ' . '}</Text>
						))}
					</Box>
				))}
			</Box>
		</Box>
	);
}
