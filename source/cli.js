#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ snake-cli

	Controls
	  Use arrow keys to move
	  Press 'q' to quit
	`,
	{
		importMeta: import.meta,
	},
);

render(<App />);
