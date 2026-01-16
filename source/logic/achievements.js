import fs from 'fs';
import path from 'path';

export const ACHIEVEMENTS = [
	// --- ОБЩИЕ / ПЕРВЫЕ ШАГИ ---
	{
		id: 'general_first_run',
		name: 'Welcome to the Pit',
		description: 'Start your very first game',
		// Сработает сразу, как только нажат Enter
		condition: (score, isAdv) => true,
	},

	// --- КЛАССИЧЕСКИЕ ---
	{
		id: 'classic_10',
		name: 'Snake Lite',
		description: 'Score 10 pts in Classic',
		condition: (score, isAdv) => !isAdv && score >= 10,
	},
	{
		id: 'classic_50',
		name: 'Classic Master',
		description: 'Score 50 pts in Classic',
		condition: (score, isAdv) => !isAdv && score >= 50,
	},
	{
		id: 'classic_100',
		name: 'The Purist',
		description: 'Score 100 pts in Classic',
		condition: (score, isAdv) => !isAdv && score >= 100,
	},
	{
		id: 'classic_rich',
		name: 'Star Collector',
		description: 'Eat 5 bonus stars in one game',
		condition: (score, isAdv, stats) => !isAdv && stats.starsEaten >= 5,
	},

	// --- ADVANCED ---
	{
		id: 'adv_first_cut',
		name: 'Fresh Cut',
		description: 'Use scissors for the first time',
		condition: (score, isAdv, stats) => isAdv && stats.scissorsUsed > 0,
	},
	{
		id: 'adv_scissor_addict',
		name: 'Scissor Addict',
		description: 'Use scissors 3 times in one session',
		condition: (score, isAdv, stats) => isAdv && stats.scissorsUsed >= 3,
	},
	{
		id: 'adv_score_50',
		name: 'Chaos Survivor',
		description: 'Score 50 pts in Advanced Mode',
		condition: (score, isAdv) => isAdv && score >= 50,
	},
];

export const checkNewAchievements = (
	score,
	isAdvanced,
	earnedIds,
	stats = {},
) => {
	return ACHIEVEMENTS.filter(ach => !earnedIds.includes(ach.id))
		.filter(ach => ach.condition(score, isAdvanced, stats))
		.map(ach => ach.id);
};

const ACHIEVEMENTS_PATH = path.join(process.cwd(), 'achievements.json');

export const getSavedAchievements = () => {
	try {
		if (fs.existsSync(ACHIEVEMENTS_PATH)) {
			const data = fs.readFileSync(ACHIEVEMENTS_PATH, 'utf8');
			return JSON.parse(data).earnedIds || [];
		}
	} catch (error) {
		return [];
	}
	return [];
};

export const saveAchievements = newIds => {
	try {
		const existingIds = getSavedAchievements();
		const updatedIds = [...new Set([...existingIds, ...newIds])];

		fs.writeFileSync(
			ACHIEVEMENTS_PATH,
			JSON.stringify({earnedIds: updatedIds}),
			'utf8',
		);
		return updatedIds;
	} catch (error) {
		return [];
	}
};
