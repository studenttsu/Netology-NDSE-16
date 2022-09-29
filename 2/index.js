import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'process';

const random = randomInt(0, 100);
console.log('Загадано число в диапазоне от 0 до 100', random);

const rl = readline.createInterface({ input, output });

next();

async function next() {
    const answer = await rl.question('');

    if (isNaN(parseInt(answer, 0))) {
        console.log('Необходимо ввести число');
        next();
    }

    if (answer > random) {
        console.log('Меньше');
        next();
    }

    if (answer < random) {
        console.log('Больше');
        next();
    }

    if (answer == random) {
        console.log(`Отгадано число ${random}`);
        rl.close();
    }
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}