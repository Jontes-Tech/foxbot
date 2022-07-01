import { createLogger } from '@lvksh/logger';
import chalk from 'chalk';

export const log = createLogger(
    {
        ok: {
            label: chalk.greenBright`[OK]`,
            newLine: '| ',
            newLineEnd: '\\-',
        },
        debug: chalk.magentaBright`[DEBUG]`,
        info: {
            label: chalk.cyan`[INFO]`,
            newLine: chalk.cyan`⮡`,
            newLineEnd: chalk.cyan`⮡`,
        },
        error: chalk.bgRed.white.bold`[ERROR]`,
    },
    { padding: 'PREPEND' },
    console.log
);
