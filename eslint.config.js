import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
	js.configs.recommended,

	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			react,
			'react-hooks': reactHooks,
			import: importPlugin,
		},
		rules: {
			'react/jsx-uses-vars': 'error',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-uses-react': 'off',

			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			'import/order': 'off',

			'no-unused-vars': [
				'warn',
				{varsIgnorePattern: '^React$', argsIgnorePattern: '^_'},
			],
			'no-console': 'off',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},

	{
		ignores: ['node_modules/', 'dist/'],
	},
];
