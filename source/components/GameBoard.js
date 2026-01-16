import React from 'react';
import {Box, Text} from 'ink';
import {FIELD_ROW} from '../constants/game.js';

export function GameBoard({
	snakeSegments,
	foodItem,
	starItem,
	scissorsItem,
	skin,
	isFogActive,
	isGhostActive,
	ghostItem,
}) {
	const head = snakeSegments[0];

	const getItem = (x, y) => {
		if (isFogActive) {
			const distanceX = Math.abs(x - head.x);
			const distanceY = Math.abs(y - head.y);

			if (distanceX > 2 || distanceY > 2) {
				return '   ';
			}
		}

		if (x === foodItem.x && y === foodItem.y) {
			return <Text>{skin.foodChar}</Text>;
		}
		if (starItem && x === starItem.x && y === starItem.y) {
			return <Text>{skin.specialChar}</Text>;
		}
		if (scissorsItem && x === scissorsItem.x && y === scissorsItem.y) {
			return <Text>✂️ </Text>;
		}
		if (ghostItem && x === ghostItem.x && y === ghostItem.y) {
			return <Text>👻 </Text>;
		}

		for (const segment of snakeSegments) {
			if (segment.x === x && segment.y === y) {
				const isHead = segment === head;
				let char;
				if (isGhostActive) {
					char = isHead ? '👻 ' : '░░ ';
				} else {
					char = isHead ? skin.headChar : skin.bodyChar;
				}

				const color = isGhostActive
					? isHead
						? 'white'
						: 'gray'
					: isHead
					? skin.head
					: skin.body;

				return (
					<Text key={`${x}-${y}`} color={color}>
						{char}
					</Text>
				);
			}
		}

		return ' . ';
	};

	return (
		<Box
			flexDirection="column"
			borderStyle="round"
			borderColor={isGhostActive ? 'white' : isFogActive ? 'gray' : 'white'}
		>
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
