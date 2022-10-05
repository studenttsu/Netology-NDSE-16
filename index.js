import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';

const argvContext = yargs(hideBin(process.argv))
    .command('audit')
    .option('name', {
        alias: 'n',
        required: true,
        type: 'string'
    })
    .argv;

const DIVIDER = '--------------------------------------';
const LOGS_DIRNAME = '.logs';
const LOG_FILE_PATH = `${LOGS_DIRNAME}/${argvContext.name}.txt`;

argvContext._[0] === 'audit' ? audit() : startGame();

function startGame() {
    if (!fs.existsSync(LOGS_DIRNAME)) {
        fs.mkdirSync(LOGS_DIRNAME);
    }

    const loggerStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' });
    const rl = readline.createInterface({ input, output });

    const random = randomInt(1, 2);
    console.log('Введите 1 или 2');

    log(`Дата ${new Date().toString()}\nЗагадано число ${random}`);
    next();

    async function next() {
        const _answer = await rl.question('');
        const answer = parseInt(_answer, 0);

        if (isNaN(answer)) {
            console.log('Необходимо ввести число');
            next();
        }

        if (answer <= 0 || answer > 2) {
            console.log('Введите 1 или 2');
            next();
        }

        const result = `${answer !== random ? 'Проиграл' : 'Выиграл'}`;
        log(`${result} \n${DIVIDER}`);
        console.log(result);

        loggerStream.end();
        rl.close();
    }

    function log(message = '') {
        if (message) {
            loggerStream.write(`${message}\n`, 'utf8');
        }
    }
}

function audit() {
    if (fs.existsSync(LOG_FILE_PATH)) {
        fs.readFile(LOG_FILE_PATH, 'utf8', (err, data) => {
            const parts = data.split(DIVIDER);
            parts.splice(parts.length - 1, 1);

            const wonCount = parts.filter(p => p.includes('Выиграл')).length;
            const lostCount = parts.filter(p => p.includes('Проиграл')).length;

            const result = `
                Количество партий: ${parts.length}
                Количество выигранных/проигранных партий: ${wonCount}/${lostCount}
                Процентное соотношение выигранных партий: ${Math.round(wonCount * 100 / parts.length)}%
            `.replaceAll('    ', '');

            console.log( result);
        });
    } else {
        throw new Error(`Файл с логом игр отсутствует. Ни одна игра не сыграна`);
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}