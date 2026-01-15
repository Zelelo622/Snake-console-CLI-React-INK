export const SLOW_SPEED = 150;
export const MIDDLE_SPEED = 110;
export const FAST_SPEED = 70;

export const START_POINTS = 5;

export const FIELD_SIZE = 16;
export const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

export const MIN_COLUMNS = 45;
export const MIN_ROWS = 25;

export const DIRECTIONS = {
	RIGHT: {x: 1, y: 0},
	LEFT: {x: -1, y: 0},
	TOP: {x: 0, y: -1},
	BOTTOM: {x: 0, y: 1},
};

export const INITIAL_SNAKE = [
	{x: 8, y: 8},
	{x: 8, y: 7},
	{x: 8, y: 6},
];

export const INITIAL_DIRECTION = DIRECTIONS.LEFT;
