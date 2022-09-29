const yargs = require('yargs/yargs');

const context = yargs(process.argv.slice(2))
    .alias('y', 'year')
    .alias('m', 'month')
    .alias('d', ['date', 'day'])
    .argv;

const Commands = {
    Current: 'current',
    Add: 'add',
    Sub: 'sub'
};

if (context._.includes('cmd')) {
    const action = context._[1];
    const availableCommands = Object.values(Commands);

    if (!action || !availableCommands.includes(action)) {
        throw new Error('Unknown command. Avaliable commands: current, add, sub');
    }

    if (action === Commands.Current) {
        console.log(getCurrentDate());
        return;
    }

    if (action === Commands.Add || action === Commands.Sub) {
        console.log(getDifferentDate(action));
        return;
    }
} else {
    throw new Error('Use "cmd" command to start getting date.');
}


function getCurrentDate() {
    const date = new Date();

    if (context.hasOwnProperty('year')) {
        return date.getFullYear();
    }

    if (context.hasOwnProperty('month')) {
        return date.getMonth();
    }

    if (context.hasOwnProperty('date')) {
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