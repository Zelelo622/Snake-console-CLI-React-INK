import fs from 'fs';
import path from 'path';

const HIGHSCORE_PATH = path.join(process.cwd(), 'highscore.json');

export const getHighScore = () => {
	try {
		if (fs.existsSync(HIGHSCORE_PATH)) {
			const data = fs.readFileSync(HIGHSCORE_PATH, 'utf8');
			return JSON.parse(data).score || 0;
		}
	} catch (error) {
		return 0;
	}

	return 0;
};

export const saveHighScore = score => {
	const currentHigh = getHighScore();
	if (score > currentHigh) {
		fs.writeFileSync(HIGHSCORE_PATH, JSON.stringify({score}), 'utf8');
		return true;
	}
    
	return false;
};
