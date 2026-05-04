import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
    globalIgnores(['dist']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            tseslint.configs.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            react,
            '@stylistic': stylistic,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...stylistic.configs.recommended.rules,
            ...react.configs.recommended.rules,
            '@stylistic/max-len': ['warn', { code: 140, ignoreComments: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true }],
            '@typescript-eslint/no-unused-vars': ['warn', {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            }],
            '@stylistic/indent': ['warn', 4, { SwitchCase: 1 }],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/comma-dangle': ['error', 'always-multiline'],
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/arrow-parens': ['error', 'always'],
            '@stylistic/member-delimiter-style': ['error', {
                multiline: {
                    delimiter: 'comma',
                    requireLast: true,
                },
                singleline: {
                    delimiter: 'comma',
                    requireLast: true,
                },
                multilineDetection: 'brackets',
            }],
            '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
            '@stylistic/function-paren-newline': ['warn', 'consistent'],
            '@stylistic/array-element-newline': ['warn', 'consistent'],
            '@stylistic/operator-linebreak': ['warn', 'before'],
            '@stylistic/jsx-wrap-multilines': ['error', { declaration: 'parens' }],
            '@stylistic/jsx-indent-props': ['warn', 4],
        }
    },
])
