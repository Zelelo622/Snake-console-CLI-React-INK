import {useEffect, useState} from 'react';
import {useStdout} from 'ink';

import {MIN_COLUMNS, MIN_ROWS} from '../constants/game.js';

export function useTerminalSize() {
	const {stdout} = useStdout();

	const [terminalTooSmall, setTerminalTooSmall] = useState(
		stdout.columns < MIN_COLUMNS || stdout.rows < MIN_ROWS,
	);

	useEffect(() => {
		const checkSize = () => {
			setTerminalTooSmall(
				stdout.columns < MIN_COLUMNS || stdout.rows < MIN_ROWS,
			);
		};

		stdout.on('resize', checkSize);
		return () => stdout.off('resize', checkSize);
	}, [stdout]);

	return {terminalTooSmall, stdout};
}
