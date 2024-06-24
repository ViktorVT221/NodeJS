const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'user.json');

let userData = {};


function loadUserData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        if (data) {
            userData = JSON.parse(data);
        }
    } catch (err) {
        console.error('Error loading user data:', err);
    }
}


function saveUserData() {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(userData), 'utf8');
    } catch (err) {
        console.error('Помилка збереження даних користувача:', err);
    }
}


function addLanguage(title, level) {
    if (!title || !level) {
        throw new Error('Необхідні поля: назва та рівень');
    }


    const languages = userData.Languages || [];


    const existingLanguage = languages.find(language => language.title === title);
    if (existingLanguage) {
        throw new Error(`Мова з назвою "${title}" вже існує`);
    }


    languages.push({ title, level });


    userData.Languages = languages;

    saveUserData();

    console.log(`Мова "${title}" успішно додана`);
}

function removeLanguage(title) {
    if (!title) {
        throw new Error('Необхідне поле: назва');
    }

    const languages = userData.Languages || [];

    const languageIndex = languages.findIndex(language => language.title === title);
    if (languageIndex === -1) {
        throw new Error(`Мова з назвою "${title}" не знайдена`);
    }
    languages.splice(languageIndex, 1);

    userData.Languages = languages;
    saveUserData();

    console.log(`Мова "${title}" успішно видалена`);
}

function listLanguages() {
    const languages = userData.Languages || [];

    if (languages.length === 0) {
        console.log('Мов не знайдено');
    } else {
        console.table(languages);
    }
}

function readLanguage(title) {
    if (!title) {
        throw new Error('Необхідне поле: назва');
    }

    const languages = userData.Languages || [];

    const language = languages.find(language => language.title === title);
    if (!language) {
        console.error(`Мова з назвою "${title}" не знайдена`);
        return;
    }

    console.log(`Інформація про мову "${language.title}":`);
    console.table(language);
}

module.exports = {
    loadUserData,
    addLanguage,
    saveUserData,
    removeLanguage,
    listLanguages,
    readLanguage,
};