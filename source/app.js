import React, {useEffect, useState} from 'react';
import {Text, Box, useApp, useInput, useStdout} from 'ink'; // Добавили useStdout
import {useInterval} from './hooks/useInterval.js';
import {Header} from './components/Header.js';

const SLOW_SPEED = 150;
const MIDDLE_SPEED = 110;
const FAST_SPEED = 70;
const FIELD_SIZE = 16;
const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

const MIN_COLUMNS = 45;
const MIN_ROWS = 25;

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

function generateFood(snakeSegments) {
	let newFood;
	let isCollision = true;

	while (isCollision) {
		newFood = {
			x: Math.floor(Math.random() * FIELD_SIZE),
			y: Math.floor(Math.random() * FIELD_SIZE),
		};

		isCollision = snakeSegments.some(
			segment => segment.x === newFood.x && segment.y === newFood.y,
		);
	}
	return newFood;
}

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

const getSpeedLevel = currentDelay => {
	if (currentDelay === SLOW_SPEED) return '1';
	if (currentDelay === MIDDLE_SPEED) return '2';
	return '3';
};

export default function App() {
	const {exit} = useApp();
	const {stdout} = useStdout();

	const [isStarted, setIsStarted] = useState(false);
	const [terminalTooSmall, setTerminalTooSmall] = useState(false);

	const [snakeSegments, setSnakeSegments] = useState(INITIAL_SNAKE);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [foodItem, setFoodItem] = useState({x: 10, y: 10});
	const [score, setScore] = useState(0);
	const [delay, setDelay] = useState(MIDDLE_SPEED);

	const [head, ...tail] = snakeSegments;
	const intersectsWithItself = tail.some(
		segment => segment.x === head.x && segment.y === head.y,
	);

	useEffect(() => {
		const checkSize = () => {
			if (stdout.columns < MIN_COLUMNS || stdout.rows < MIN_ROWS) {
				setTerminalTooSmall(true);
			} else {
				setTerminalTooSmall(false);
			}
		};

		checkSize();
		stdout.on('resize', checkSize);
		return () => stdout.off('resize', checkSize);
	}, [stdout]);

	const restartGame = () => {
		setSnakeSegments(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		setFoodItem(generateFood(INITIAL_SNAKE));
		setScore(0);
		setDelay(MIDDLE_SPEED);
	};

	useInterval(
		() => {
			setSnakeSegments(segments =>
				newSnakePosition(segments, direction, foodItem),
			);
		},

		isStarted && !intersectsWithItself && !terminalTooSmall ? delay : null,
	);

	useInput((input, key) => {
		if (input === 'q') exit();

		if (key.return && !isStarted && !terminalTooSmall) {
			setIsStarted(true);
		}

		if (input === 'r') restartGame();

		if (isStarted) {
			if (input === '1') setDelay(SLOW_SPEED);
			if (input === '2') setDelay(MIDDLE_SPEED);
			if (input === '3') setDelay(FAST_SPEED);

			if (key.upArrow && direction !== DIRECTIONS.BOTTOM)
				setDirection(DIRECTIONS.TOP);
			if (key.downArrow && direction !== DIRECTIONS.TOP)
				setDirection(DIRECTIONS.BOTTOM);
			if (key.leftArrow && direction !== DIRECTIONS.RIGHT)
				setDirection(DIRECTIONS.LEFT);
			if (key.rightArrow && direction !== DIRECTIONS.LEFT)
				setDirection(DIRECTIONS.RIGHT);
		}
	});

	useEffect(() => {
		if (head.x === foodItem.x && head.y === foodItem.y) {
			setScore(prev => prev + 1);
			setFoodItem(generateFood(snakeSegments));
		}
	}, [head, foodItem, snakeSegments]);

	if (terminalTooSmall) {
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

	if (!isStarted) {
		return (
			<Box
				flexDirection="column"
				alignItems="center"
				borderStyle="round"
				borderColor="cyan"
				padding={1}
			>
				<Header />
				<Box marginTop={1} flexDirection="column" alignItems="center">
					<Text bold color="yellow">
						Welcome to Snake!
					</Text>
					<Box marginTop={1}>
						<Text inverted color="green">
							{' '}
							PRESS ENTER TO START{' '}
						</Text>
					</Box>
					<Box marginTop={1}>
						<Text dimColor>Use Arrow Keys to move after start</Text>
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			flexDirection="column"
			alignItems="center"
			borderStyle="round"
			borderColor="cyan"
			paddingX={1}
		>
			<Box marginY={1} flexDirection="row">
				<Box marginRight={2}>
					<Text>Score: </Text>
					<Text color="yellow" bold>
						{score}
					</Text>
				</Box>
				<Box>
					<Text>Speed: </Text>
					<Text color="magenta" bold>
						{getSpeedLevel(delay)}
					</Text>
				</Box>
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
		</Box>
	);
}
