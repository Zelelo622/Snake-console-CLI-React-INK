import {Box, Text, useInput} from 'ink';
import React, {useState} from 'react';

const AchievementsScreen = ({achievements, earnedIds, onBack}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const visibleCount = 5;

	useInput((input, key) => {
		if (key.upArrow) {
			setSelectedIndex(prev => Math.max(0, prev - 1));
		}
		if (key.downArrow) {
			setSelectedIndex(prev => Math.min(achievements.length - 1, prev + 1));
		}
		if (key.escape || input === 'b') {
			onBack();
		}
	});

	return (
		<Box flexDirection="column" alignItems="center" padding={1}>
			<Text bold color="yellow" marginBottom={1}>
				🏆 TOTAL ACHIEVEMENTS: {earnedIds.length} / {achievements.length}
			</Text>

			<Box
				flexDirection="column"
				borderStyle="single"
				borderColor="cyan"
				padding={2}
				width={50}
			>
				{achievements.map((ach, index) => {
					const isEarned = earnedIds.includes(ach.id);
					const isSelected = index === selectedIndex;

					if (index < selectedIndex - 2 || index > selectedIndex + 2) {
						return null;
					}

					return (
						<Box key={ach.id} flexDirection="column" marginY={1}>
							<Text bold color={isEarned ? 'green' : 'gray'}>
								{isSelected ? '> ' : ' '}
								{isEarned ? '✔ ' : '🔒'} {ach.name}
							</Text>
							<Text dimColor={!isEarned}>
								{isEarned ? ach.description : '??? (Locked)'}
							</Text>
						</Box>
					);
				})}
			</Box>

			<Text marginY={1} dimColor>
				Use Up/Down Arrows to scroll • Press 'B' or ESC to return
			</Text>
		</Box>
	);
};

export default AchievementsScreen;
