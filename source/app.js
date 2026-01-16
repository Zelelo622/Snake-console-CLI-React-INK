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
	SKINS,
} from './constants/game.js';

import {useInterval} from './hooks/useInterval.js';
import {useTerminalSize} from './hooks/useTerminalSize.js';

import {generateFood} from './logic/food.js';
import {cutSnake, newSnakePosition} from './logic/snake.js';
import {getSpeedLevel} from './logic/speed.js';

import {GameBoard} from './components/GameBoard.js';
import {GameInfo} from './components/GameInfo.js';
import {GameOver} from './components/GameOver.js';
import {StartScreen} from './components/StartScreen.js';
import {Controls} from './components/Controls.js';
import {ScreenError} from './components/ScreenError.js';
import {getHighScore, saveHighScore} from './logic/highscore.js';
import {isItemEaten} from './logic/items.js';
import {
	ACHIEVEMENTS,
	checkNewAchievements,
	getSavedAchievements,
	saveAchievements,
} from './logic/achievements.js';
import {Notification} from './components/Notification.js';
import AchievementsScreen from './components/AchievementsScreen.js';

export default function App() {
	const {exit} = useApp();
	const {terminalTooSmall, stdout} = useTerminalSize();

	// Навигация
	const [currentScreen, setCurrentScreen] = useState('START'); // START, GAME, ACHIEVEMENTS

	// Состояния игры
	const [isAdvancedMode, setIsAdvancedMode] = useState(false);
	const [snakeSegments, setSnakeSegments] = useState(INITIAL_SNAKE);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [score, setScore] = useState(0);
	const [delay, setDelay] = useState(MIDDLE_SPEED);
	const [highScore, setHighScore] = useState(0);
	const [selectedSkinIndex, setSelectedSkinIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	const [isFogActive, setIsFogActive] = useState(false);

	// Достижения и Статистика
	const [earnedAchievements, setEarnedAchievements] = useState([]);
	const [activeAchievement, setActiveAchievement] = useState(null);
	const [sessionStats, setSessionStats] = useState({
		scissorsUsed: 0,
		starsEaten: 0,
	});

	// Предметы
	const [foodItem, setFoodItem] = useState({x: 10, y: 10});
	const [starItem, setStarItem] = useState(null);
	const [scissorsItem, setScissorsItem] = useState(null);

	const snakeRef = useRef(snakeSegments);
	const directionQueue = useRef([]);
	const isSaved = useRef(false);

	const [head, ...tail] = snakeSegments;
	const intersects = tail.some(s => s.x === head.x && s.y === head.y);

	const restartGame = () => {
		setSnakeSegments(INITIAL_SNAKE);
		setDirection(INITIAL_DIRECTION);
		setFoodItem(generateFood(INITIAL_SNAKE));
		setStarItem(null);
		setScissorsItem(null);
		setScore(0);
		setIsPaused(false);
		setDelay(MIDDLE_SPEED);
		setActiveAchievement(null);
		setSessionStats({scissorsUsed: 0, starsEaten: 0});
	};

	const backToMenu = () => {
		setCurrentScreen('START');
		restartGame();
	};

	useInterval(
		() => {
			if (directionQueue.current.length > 0) {
				setDirection(directionQueue.current.shift());
			}

			setSnakeSegments(s => newSnakePosition(s, direction, foodItem));
		},
		currentScreen === 'GAME' && !intersects && !isPaused && !terminalTooSmall
			? delay
			: null,
	);

	const isOpposite = (a, b) =>
		(a === DIRECTIONS.TOP && b === DIRECTIONS.BOTTOM) ||
		(a === DIRECTIONS.BOTTOM && b === DIRECTIONS.TOP) ||
		(a === DIRECTIONS.LEFT && b === DIRECTIONS.RIGHT) ||
		(a === DIRECTIONS.RIGHT && b === DIRECTIONS.LEFT);

	useInput((input, key) => {
		if (input === 'q') exit();

		if (currentScreen === 'START') {
			if (input === 'v') setCurrentScreen('ACHIEVEMENTS');
			if (input === 'a') setIsAdvancedMode(prev => !prev);
			if (input === 's' || key.rightArrow) {
				setSelectedSkinIndex(prev => (prev + 1) % SKINS.length);
			}
			if (key.leftArrow) {
				setSelectedSkinIndex(prev => (prev - 1 + SKINS.length) % SKINS.length);
			}
			if (key.return) {
				if (highScore >= SKINS[selectedSkinIndex].requirement) {
					setCurrentScreen('GAME');
				}
			}
			return;
		}

		if (currentScreen === 'ACHIEVEMENTS') {
			if (input === 'b' || key.escape) setCurrentScreen('START');
			return;
		}

		if (currentScreen === 'GAME') {
			if (input === 'r') restartGame();
			if (input === 'p') setIsPaused(prev => !prev);
			if (input === 'm') backToMenu();

			if (isPaused || intersects) return;

			if (input === '1') setDelay(SLOW_SPEED);
			if (input === '2') setDelay(MIDDLE_SPEED);
			if (input === '3') setDelay(FAST_SPEED);

			let next = null;
			if (key.upArrow) next = DIRECTIONS.TOP;
			if (key.downArrow) next = DIRECTIONS.BOTTOM;
			if (key.leftArrow) next = DIRECTIONS.LEFT;
			if (key.rightArrow) next = DIRECTIONS.RIGHT;

			if (next) {
				const last = directionQueue.current.at(-1) ?? direction;
				if (!isOpposite(last, next)) {
					directionQueue.current.push(next);
				}
			}
		}
	});

	useEffect(() => {
		setHighScore(getHighScore());
		setEarnedAchievements(getSavedAchievements());
	}, []);

	useEffect(() => {
		if (intersects && !isSaved.current) {
			const isNewRecord = saveHighScore(score);
			if (isNewRecord) {
				setHighScore(score);
			}
			isSaved.current = true;
			setActiveAchievement(null);
		}

		if (!intersects) {
			isSaved.current = false;
		}
	}, [intersects, score]);

	useEffect(() => {
		snakeRef.current = snakeSegments;
	}, [snakeSegments]);

	useEffect(() => {
		if (currentScreen !== 'GAME' || intersects) return;

		const fogInt = setInterval(() => {
			if (isAdvancedMode) {
				setIsFogActive(true);

				setTimeout(() => {
					setIsFogActive(false);
				}, 6000);
			}
		}, 300000);

		const starInt = setInterval(() => {
			setStarItem(generateFood(snakeRef.current));
			setTimeout(() => setStarItem(null), 6000);
		}, 30000);

		const scissInt = setInterval(() => {
			if (isAdvancedMode) {
				setScissorsItem(generateFood(snakeRef.current));
				setTimeout(() => setScissorsItem(null), 8000);
			}
		}, 45000);

		return () => {
			clearInterval(fogInt);
			clearInterval(starInt);
			clearInterval(scissInt);
		};
	}, [currentScreen, intersects, isAdvancedMode]);

	useEffect(() => {
		snakeRef.current = snakeSegments;
		if (isItemEaten(head, foodItem)) {
			setScore(s => s + 1);
			setFoodItem(generateFood(snakeSegments));
		}
		if (isItemEaten(head, starItem)) {
			setScore(s => s + START_POINTS);
			setStarItem(null);
			setSessionStats(prev => ({...prev, starsEaten: prev.starsEaten + 1}));
		}
		if (isAdvancedMode && isItemEaten(head, scissorsItem)) {
			setSnakeSegments(prev => cutSnake(prev));
			setScissorsItem(null);
			setSessionStats(prev => ({...prev, scissorsUsed: prev.scissorsUsed + 1}));
		}
	}, [head, foodItem, starItem, scissorsItem]);

	useEffect(() => {
		if (currentScreen !== 'GAME') return;

		const newIds = checkNewAchievements(
			score,
			isAdvancedMode,
			earnedAchievements,
			sessionStats,
		);

		if (newIds.length > 0) {
			saveAchievements(newIds);
			setEarnedAchievements(prev => [...new Set([...prev, ...newIds])]);

			const firstAch = ACHIEVEMENTS.find(a => a.id === newIds[0]);
			setActiveAchievement(firstAch);
		}
	}, [score, isAdvancedMode, sessionStats, currentScreen]);

	if (terminalTooSmall) {
		return <ScreenError stdout={stdout} />;
	}

	if (currentScreen === 'ACHIEVEMENTS') {
		return (
			<AchievementsScreen
				achievements={ACHIEVEMENTS}
				earnedIds={earnedAchievements}
				onBack={() => setCurrentScreen('START')}
			/>
		);
	}

	if (currentScreen === 'START') {
		return (
			<StartScreen
				highScore={highScore}
				selectedSkinIndex={selectedSkinIndex}
				skins={SKINS}
				isAdvancedMode={isAdvancedMode}
			/>
		);
	}

	return (
		<Box flexDirection="column" alignItems="center">
			{!intersects && (
				<GameInfo
					score={score}
					highScore={highScore}
					speedLevel={getSpeedLevel(delay)}
				/>
			)}
			{intersects ? (
				<GameOver score={score} highScore={highScore} />
			) : (
				<GameBoard
					snakeSegments={snakeSegments}
					foodItem={foodItem}
					starItem={starItem}
					scissorsItem={scissorsItem}
					skin={SKINS[selectedSkinIndex]}
					isFogActive={isFogActive}
				/>
			)}

			{!intersects && <Controls />}

			{activeAchievement && !intersects && (
				<Notification
					key={activeAchievement.id}
					achievement={activeAchievement}
					onFinished={() => setActiveAchievement(null)}
				/>
			)}
		</Box>
	);
}
