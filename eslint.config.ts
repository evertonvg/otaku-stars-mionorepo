import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
	js.configs.recommended,
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parser: tsParser as any,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: ['./tsconfig.base.json'],
			},
		},
		plugins: {
			'@typescript-eslint': typescript as any,
			'simple-import-sort': simpleImportSort as any,
		},
		rules: {
			'use-tabs': 'on',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'semi': ['error', 'always'],
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab'],
			'comma-dangle': ['error', 'always-multiline'],
			'object-curly-spacing': ['error', 'always'],
			'array-bracket-spacing': ['error', 'never'],
			'no-multiple-empty-lines': ['error', { max: 0, maxEOF: 0, maxBOF: 0 }],
			'space-before-blocks': ['error', 'always'],

			// **regras para organizar imports**
			'simple-import-sort/imports': 'error',
			'simple-import-sort/exports': 'error',
		},
	},
	prettier,
];
