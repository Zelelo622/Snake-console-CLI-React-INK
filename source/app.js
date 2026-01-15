import React, {useEffect, useRef, useState} from 'react';
import {Box, useApp, useInput} from 'ink';

import {
	SLOW_SPEED,
	MIDDLE_SPEED,
	FAST_SPEED,
	DIRECTIONS,
	INITIAL_SNAKE,
	INITIAL_DIRECTION,
	START_POINTS,
} from './constants/game.js';

import {useInterval} from './hooks/useInterval.js';
import {useTerminalSize} from './hooks/useTerminalSize.js';

import {generateFood} from './logic/food.js';
import {newSnakePosition} from './logic/snake.js';
import {getSpeedLevel} from './logic/speed.js';

import {GameBoard} from './components/GameBoard.js';
import {GameInfo} from './components/GameInfo.js';
import {GameOver} from './components/GameOver.js';
import {StartScreen} from './components/StartScreen.js';
import {Controls} from './components/Controls.js';
import {ScreenError} from './components/ScreenError.js';

export default function App() {
	const {exit} = useApp();
	const {terminalTooSmall, stdout} = useTerminalSize();

	const [isStarted, setIsStarted] = useState(false);
	const [snakeSegments, setSnakeSegments] = useState(INITIAL_SNAKE);
	const snakeRef = useRef(snakeSegments);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const directionQueue = useRef([]);
	const [foodItem, setFoodItem] = useState({x: 10, y: 10});
	const [score, setScore] = useState(0);
	const [delay, setDelay] = useState(MIDDLE_SPEED);
	const [starItem, setStarItem] = useState(null);

	const [head, ...tail] = snakeSegments;
	const intersects = tail.some(s => s.x === head.x && s.y === head.y);

	const restartGame = () => {
		setSnakeSegments(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		setFoodItem(generateFood(INITIAL_SNAKE));
		setScore(0);
		setDelay(MIDDLE_SPEED);
	};

	useInterval(
		() => {
			if (directionQueue.current.length > 0) {
				setDirection(directionQueue.current.shift());
			}

			setSnakeSegments(s => newSnakePosition(s, direction, foodItem));
		},
		isStarted && !intersects && !terminalTooSmall ? delay : null,
	);

	const isOpposite = (a, b) =>
		(a === DIRECTIONS.TOP && b === DIRECTIONS.BOTTOM) ||
		(a === DIRECTIONS.BOTTOM && b === DIRECTIONS.TOP) ||
		(a === DIRECTIONS.LEFT && b === DIRECTIONS.RIGHT) ||
		(a === DIRECTIONS.RIGHT && b === DIRECTIONS.LEFT);

	useInput((input, key) => {
		if (input === 'q') exit();
		if (key.return && !isStarted) setIsStarted(true);
		if (input === 'r') restartGame();

		if (!isStarted) return;

		if (input === '1') setDelay(SLOW_SPEED);
		if (input === '2') setDelay(MIDDLE_SPEED);
		if (input === '3') setDelay(FAST_SPEED);

		let next = null;

		if (key.upArrow) next = DIRECTIONS.TOP;
		if (key.downArrow) next = DIRECTIONS.BOTTOM;
		if (key.leftArrow) next = DIRECTIONS.LEFT;
		if (key.rightArrow) next = DIRECTIONS.RIGHT;

		if (!next) return;

		const last = directionQueue.current.at(-1) ?? direction;

		if (!isOpposite(last, next)) {
			directionQueue.current.push(next);
		}
	});

	useEffect(() => {
		snakeRef.current = snakeSegments;
	}, [snakeSegments]);

	useEffect(() => {
		if (!isStarted || intersects) return;
		
		const spawnStar = () => {
			const newStar = generateFood(snakeRef.current);
			setStarItem(newStar);

			setTimeout(() => setStarItem(null), 6_000)
		}

		const starInterval = setInterval(spawnStar, 30_000);

		return () => clearInterval(starInterval)
	}, [isStarted, intersects]);

	useEffect(() => {
		if (head.x === foodItem.x && head.y === foodItem.y) {
			setScore(s => s + 1);
			setFoodItem(generateFood(snakeSegments));
		}

		if (starItem && head.x === starItem.x && head.y === starItem.y) {
			setScore(s => s + START_POINTS);
			setStarItem(null);
		}
	}, [head, foodItem, starItem, snakeSegments]);

	if (terminalTooSmall) {
		return <ScreenError stdout={stdout} />;
	}

	if (!isStarted) {
		return <StartScreen />;
	}

	return (
		<Box flexDirection="column" alignItems="center">
			{!intersects && (
				<GameInfo score={score} speedLevel={getSpeedLevel(delay)} />
			)}
			{intersects ? (
				<GameOver score={score} />
			) : (
				<GameBoard
					snakeSegments={snakeSegments}
					foodItem={foodItem}
					starItem={starItem}
				/>
			)}

			{!intersects && <Controls />}
		</Box>
	);
}
