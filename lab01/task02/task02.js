const fs = require('fs');

const filePath = 'task02.txt';
const newLine = 'Hello world';

fs.appendFile(filePath, newLine + '\n', (err) => {
    if (err) {
        console.error('Помилка під час додавання рядка до файлу:', err);
        return;
    }
});

