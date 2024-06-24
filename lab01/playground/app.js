const yargs = require('yargs');
const userModule = require('./user');

const ERROR_CODES = {
    LANGUAGE_EXISTS: 'LANGUAGE_EXISTS',
    INVALID_LEVEL: 'INVALID_LEVEL',
    LANGUAGE_NOT_FOUND: 'LANGUAGE_NOT_FOUND',
};


yargs.default('command', () => {
    userModule.loadUserData();
});

yargs
    .command('add', 'Додати нову мову до вашого профілю', {
        title: {
            type: 'string',
            description: 'Назва мови',
            demand: true,
        },
        level: {
            type: 'string',
            description: 'Рівень володіння мовою (напр., Початківець, Середній, Досконалий)',
            demand: true,
        },
    }, ({ title, level }) => {
        try {
            userModule.addLanguage(title, level);
        } catch (err) {
            if (err.code === ERROR_CODES.LANGUAGE_EXISTS) {
                console.error('Мова з такою назвою вже існує.');
            } else if (err.code === ERROR_CODES.INVALID_LEVEL) {
                console.error('Неправильний рівень володіння мовою.');
            } else {
                console.error('Непередбачувана помилка.');
            }
            throw err;
        }
    })
    .command('remove', 'Видалити мову з вашого профілю', {
        title: {
            type: 'string',
            description: 'Назва мови, яку потрібно видалити',
            demand: true,
        },
    }, ({ title }) => {
        try {
            userModule.removeLanguage(title);
        } catch (err) {
            if (err.code === ERROR_CODES.LANGUAGE_NOT_FOUND) {
                console.error('Мова з такою назвою не знайдена.');
            } else {
                console.error('Непередбачувана помилка.');
            }
            throw err;
        }
    })
    .command('list', 'Перелік всіх мов у вашому профілі', {}, ({}) => {
        userModule.listLanguages();
    })
    .command('read', 'Переглянути інформацію про мову', {
        title: {
            type: 'string',
            description: 'Назва мови, про яку потрібно отримати інформацію',
            demand: true,
        },
    }, ({ title }) => {
        try {
            userModule.readLanguage(title);
        } catch (err) {
            if (err.code === ERROR_CODES.LANGUAGE_NOT_FOUND) {
                console.error('Мова з такою назвою не знайдена.');
            } else {
                console.error('Непередбачувана помилка.');
            }
            throw err;
        }
    })
    .version()
    .help()
    .alias('h', 'help')
    .argv;
