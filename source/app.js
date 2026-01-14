import React, {useEffect, useState} from 'react';
import {Text, Box, useApp, useInput} from 'ink';
import {useInterval} from './hooks/useInterval.js';

const FIELD_SIZE = 16;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

const DIRECTIONS = {
	RIGHT: {x: 1, y: 0},
	LEFT: {x: -1, y: 0},
	TOP: {x: 0, y: -1},
	BOTTOM: {x: 0, y: 1},
};

const INITIAL_SNAKE = [
	{x: 8, y: 8},
	{x: 8, y: 7},
	{x: 8, y: 6},
];
const INITIAL_DIRECTION = DIRECTIONS.LEFT;

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
	if (x >= FIELD_SIZE) return 0;
	if (x < 0) return FIELD_SIZE - 1;
	return x;
}

export default function App() {
	const {exit} = useApp();
	const [snakeSegments, setSnakeSegments] = useState(INITIAL_SNAKE);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [foodItem, setFoodItem] = useState({x: 10, y: 10});
	const [score, setScore] = useState(0);

	const [head, ...tail] = snakeSegments;
	const intersectsWithItself = tail.some(
		segment => segment.x === head.x && segment.y === head.y,
	);

	const restartGame = () => {
		setSnakeSegments(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		setFoodItem({x: 5, y: 5});
		setScore(0);
	};

	useInterval(
		() => {
			setSnakeSegments(segments =>
				newSnakePosition(segments, direction, foodItem),
			);
		},
		intersectsWithItself ? null : 100,
	);

	useInput((input, key) => {
		if (input === 'q') exit();
		if (input === 'r') restartGame();

		if (key.upArrow && direction !== DIRECTIONS.BOTTOM)
			setDirection(DIRECTIONS.TOP);
		if (key.downArrow && direction !== DIRECTIONS.TOP)
			setDirection(DIRECTIONS.BOTTOM);
		if (key.leftArrow && direction !== DIRECTIONS.RIGHT)
			setDirection(DIRECTIONS.LEFT);
		if (key.rightArrow && direction !== DIRECTIONS.LEFT)
			setDirection(DIRECTIONS.RIGHT);
	});

	useEffect(() => {
		if (head.x === foodItem.x && head.y === foodItem.y) {
			setScore(prev => prev + 1);
			setFoodItem({
				x: Math.floor(Math.random() * FIELD_SIZE),
				y: Math.floor(Math.random() * FIELD_SIZE),
			});
		}
	}, [head, foodItem]);

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			borderStyle="round"
			borderColor="cyan"
			paddingX={1}
		>
			<Text color="cyan" bold>
				{' '}
				Snake CLI 🐍{' '}
			</Text>

			<Box marginY={1}>
				<Text>Score: </Text>
				<Text color="yellow" bold>
					{score}
				</Text>
			</Box>

			{intersectsWithItself ? (
				<Box flexDirection="column" alignItems="center">
					<Text color="red" bold>
						💥 GAME OVER 💥
					</Text>
					<Text color="white">Final Score: {score}</Text>
					<Box marginTop={1}>
						<Text inverted color="yellow">
							{' '}
							Press 'r' to Restart{' '}
						</Text>
					</Box>
				</Box>
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

			<Box marginTop={1} flexDirection="column" alignItems="center">
				<Text dimColor>----------------------------</Text>
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
		</Box>
	);
}
