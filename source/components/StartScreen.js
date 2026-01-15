import React from 'react';
import {Box, Text} from 'ink';
import {Header} from './Header.js';

export function StartScreen({highScore, selectedSkinIndex, skins}) {
	return (
		<Box flexDirection="column" alignItems="center" padding={1}>
			<Header />
			<Text bold color="yellow">
				Welcome to Snake!
			</Text>

			<Box marginTop={1} flexDirection="column" alignItems="center">
				<Text color="magenta">── SELECT YOUR SKIN ──</Text>
				<Box marginTop={1}>
					{skins.map((skin, index) => {
						const isSelected = index === selectedSkinIndex;
						const isLocked = highScore < skin.requirement;

						return (
							<Box
								key={skin.id}
								marginX={1}
								paddingX={1}
								borderStyle={isSelected ? 'double' : 'single'}
								borderColor={isSelected ? 'cyan' : 'gray'}
							>
								{isLocked ? (
									<Text color="gray">🔒 {skin.requirement} pts</Text>
								) : (
									<Box>
										<Text color={isSelected ? 'yellow' : 'white'}>
											{skin.headChar}
											{skin.bodyChar} {skin.name}
										</Text>
									</Box>
								)}
							</Box>
						);
					})}
				</Box>
				<Text dimColor marginTop={1}>
					Use 'S' or Arrow Keys to cycle skins
				</Text>
			</Box>

			<Box marginTop={1}>
				<Text inverted color="green">
					{' '}
					PRESS ENTER TO START{' '}
				</Text>
			</Box>
		</Box>
	);
}
