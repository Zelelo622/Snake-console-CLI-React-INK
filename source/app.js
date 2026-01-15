import React, {useEffect, useState} from 'react';
import {Box, useApp, useInput} from 'ink';

import {
	SLOW_SPEED,
	MIDDLE_SPEED,
	FAST_SPEED,
	DIRECTIONS,
	INITIAL_SNAKE,
	INITIAL_DIRECTION,
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
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [foodItem, setFoodItem] = useState({x: 10, y: 10});
	const [score, setScore] = useState(0);
	const [delay, setDelay] = useState(MIDDLE_SPEED);

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
			setSnakeSegments(s => newSnakePosition(s, direction, foodItem));
		},
		isStarted && !intersects && !terminalTooSmall ? delay : null,
	);

	useInput((input, key) => {
		if (input === 'q') exit();
		if (key.return && !isStarted) setIsStarted(true);
		if (input === 'r') restartGame();

		if (!isStarted) return;

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
	});

	useEffect(() => {
		if (head.x === foodItem.x && head.y === foodItem.y) {
			setScore(s => s + 1);
			setFoodItem(generateFood(snakeSegments));
		}
	}, [head, foodItem, snakeSegments]);

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
				<GameBoard snakeSegments={snakeSegments} foodItem={foodItem} />
			)}

			{!intersects && <Controls />}
		</Box>
	);
}
