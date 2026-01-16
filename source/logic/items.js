import {generateFood} from './food.js';

export const isItemEaten = (head, item) => {
	return item && head.x === item.x && head.y === item.y;
};

export const spawnBonusItem = snakeSegments => {
	return generateFood(snakeSegments);
};
