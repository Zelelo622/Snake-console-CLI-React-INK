import React, {memo} from 'react';
import {Box, Text} from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

export const Header = memo(() => (
	<Box flexDirection="column" alignItems="center" marginBottom={1}>
		<Gradient name="atlas">
			<BigText text="SNAKE" font="block" />
		</Gradient>

		<Box marginTop={-1}>
			<Text backgroundColor="cyan" color="black" bold>
				{' '}
				CLI EDITION v2.0{' '}
			</Text>
		</Box>
	</Box>
));
