import React from 'react';
import {Box, Text} from 'ink';
import {FIELD_ROW} from '../constants/game.js';

export function GameBoard({snakeSegments, foodItem, starItem, skin}) {
	const getItem = (x, y) => {
		if (x === foodItem.x && y === foodItem.y) {
			return <Text>{skin.foodChar}</Text>;
		}
		if (starItem && x === starItem.x && y === starItem.y) {
			return <Text>{skin.specialChar}</Text>;
		}

		const head = snakeSegments[0];

		for (const segment of snakeSegments) {
			if (segment.x === x && segment.y === y) {
				const isHead = segment === head;

				const char = isHead ? skin.headChar : skin.bodyChar;
				const color = isHead ? skin.head : skin.body;

				return <Text color={color}>{`${char}`}</Text>;
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
