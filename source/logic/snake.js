import {FIELD_SIZE} from '../constants/game.js';

export function limitByField(x) {
	if (x >= FIELD_SIZE) return 0;
	if (x < 0) return FIELD_SIZE - 1;
	return x;
}

export function newSnakePosition(segments, direction, foodItem) {
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

export function cutSnake(segments) {
	return segments.length > 3 ? segments.slice(0, 3) : segments;
}
