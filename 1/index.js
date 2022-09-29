const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const context = yargs(hideBin(process.argv))
    .command('current', 'Получить текущую дату. При наличии опций вернёт год, месяц или день месяца')
    .command('add', 'Получить дату в будущем. Возвращает дату в формате ISO')
    .command('sub', 'Получить дату в прошлом. Возвращает дату в формате ISO')
    .option('year', {
        alias: 'y',
        type: 'number'
    })
    .option('month', {
        alias: 'm',
        type: 'number'
    })
    .option('day', {
        alias: 'd',
        type: 'number'
    })
    .argv;

const Commands = {
    Current: 'current',
    Add: 'add',
    Sub: 'sub'
};

init();

function init() {
    const action = context._[0];
    const availableCommands = Object.values(Commands);
    
    if (!action || !availableCommands.includes(action)) {
        throw new Error('Unknown command. Avaliable commands: current, add, sub');
    }
    
    if (action === Commands.Current) {
        console.log(getCurrentDate());
    }
    
    if (action === Commands.Add || action === Commands.Sub) {
        console.log(getDifferentDate(action));
    }
}

function getCurrentDate() {
    const date = new Date();

    if (context.hasOwnProperty('year')) {
        return date.getFullYear();
    }

    if (context.hasOwnProperty('month')) {
        return date.getMonth();
    }

    if (context.hasOwnProperty('day')) {
        return date.getDate();
    }

    return date.toISOString();
}

function getDifferentDate(action) {
    const date = new Date();
    const direction = action === Commands.Add ? 1 : -1;

    if (context.hasOwnProperty('year')) {
        date.setFullYear(date.getFullYear() + (context.y * direction));
    }

    if (context.hasOwnProperty('month')) {
        date.setMonth(date.getMonth() + (context.m * direction));
    }

    if (context.hasOwnProperty('day')) {
        date.setDate(date.getDate() + (context.d * direction));
    }

    return date.toISOString();
}