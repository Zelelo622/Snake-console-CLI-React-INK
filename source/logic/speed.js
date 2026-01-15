import {SLOW_SPEED, MIDDLE_SPEED} from '../constants/game.js';

export const getSpeedLevel = delay => {
	if (delay === SLOW_SPEED) return '1';
	if (delay === MIDDLE_SPEED) return '2';
	return '3';
};
