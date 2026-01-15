import {FIELD_SIZE} from '../constants/game.js';

export function generateFood(snakeSegments) {
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
