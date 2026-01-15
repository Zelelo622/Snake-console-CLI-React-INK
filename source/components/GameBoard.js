import React from 'react';
import {Box, Text} from 'ink';
import {FIELD_ROW} from '../constants/game.js';

export function GameBoard({snakeSegments, foodItem, starItem}) {
	const getItem = (x, y) => {
		if (x === foodItem.x && y === foodItem.y) {
			return <Text>🍎 </Text>;
		}

		if (starItem && x === starItem.x && y === starItem.y) {
			return <Text>⭐</Text>
		}

		const head = snakeSegments[0];
		for (const segment of snakeSegments) {
			const isHead = head === segment;
			if (segment.x === x && segment.y === y) {
				return <Text color={isHead ? "yellow" : "green"}> ◼ </Text>;
			}
		}

		return ' . ';
	};

	return (
		<Box flexDirection="column">
			{FIELD_ROW.map(y => (
				<Box key={y}>
					{FIELD_ROW.map(x => (
						<Text key={x}>{getItem(x, y)}</Text>
					))}
				</Box>
			))}
		</Box>
	);
}
