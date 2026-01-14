import React, {useEffect, useState} from 'react';
import {Text, Box, useApp, useStdin, useInput} from 'ink';
import {useInterval} from './hooks/useInterval.js';

const FIELD_SIZE = 16;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

const DIRECTIONS = {
	RIGHT: {x: 1, y: 0},
	LEFT: {x: -1, y: 0},
	TOP: {x: 0, y: -1},
	BOTTOM: {x: 0, y: 1},
};

function getItem(x, y, snakeSegments, foodItem) {
	if (x === foodItem.x && y === foodItem.y) {
		return <Text>🍎 </Text>;
	}

	for (const segment of snakeSegments) {
		if (x === segment.x && y === segment.y) {
			return <Text color="green"> ◼ </Text>;
		}
	}
}

function newSnakePosition(segments, direction, foodItem) {
	const [head] = segments;
	const newHead = {
		x: limitByField(head.x + direction.x),
		y: limitByField(head.y + direction.y),
	};

	if (newHead.x === foodItem.x && newHead.y === foodItem.y) {
		return [newHead, ...segments];
	}
	return [newHead, ...segments.slice(0, -1)];
}

function limitByField(x) {
	if (x >= FIELD_SIZE) {
		return 0;
	}
	if (x < 0) {
		return FIELD_SIZE - 1;
	}

	return x;
}

export default function App() {
	const {exit} = useApp();
	const [snakeSegments, setSnakeSegments] = useState([
		{x: 8, y: 8},
		{x: 8, y: 7},
		{x: 8, y: 6},
	]);
	const [direction, setDirection] = useState(DIRECTIONS.LEFT);
	const [foodItem, setFoodItem] = useState({
		x: 10,
		y: 10,
	});
	const [head, ...tail] = snakeSegments;

	const intersectsWithItself = tail.some(
		segment => segment.x === head.x && segment.y === head.y,
	);

	useInterval(
		() => {
			setSnakeSegments(segments =>
				newSnakePosition(segments, direction, foodItem),
			);
		},
		intersectsWithItself ? null : 50,
	);

	useInput((input, key) => {
		if (input === 'q') exit();

		if (key.upArrow && direction !== DIRECTIONS.BOTTOM) {
			setDirection(DIRECTIONS.TOP);
		}
		if (key.downArrow && direction !== DIRECTIONS.TOP) {
			setDirection(DIRECTIONS.BOTTOM);
		}
		if (key.leftArrow && direction !== DIRECTIONS.RIGHT) {
			setDirection(DIRECTIONS.LEFT);
		}
		if (key.rightArrow && direction !== DIRECTIONS.LEFT) {
			setDirection(DIRECTIONS.RIGHT);
		}
	}, []);

	if (head.x === foodItem.x && head.y === foodItem.y) {
		setFoodItem({
			x: Math.round(Math.random() * FIELD_SIZE),
			y: Math.round(Math.random() * FIELD_SIZE),
		});
	}

	return (
		<Box flexDirection="column" alignItems="center">
			<Text color="cyan" bold>
				Snake CLI 🐍
			</Text>
			{intersectsWithItself ? (
				<Text color="red">Game Over</Text>
			) : (
				<Box flexDirection="column">
					{FIELD_ROW.map(y => (
						<Box key={y}>
							{FIELD_ROW.map(x => (
								<Text key={x}>
									{getItem(x, y, snakeSegments, foodItem) || ' . '}
								</Text>
							))}
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}
