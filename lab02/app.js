const express = require("express");
const hbs = require("hbs");
const fetch = require("node-fetch");


hbs.registerPartials(__dirname + '/views/partials');
const app = express()
app.set('view engine', 'hbs');
const port = 3000

app.get('/', (req, res) => {
    res.render("main.hbs")
});

app.get('/login', (req, res) => {
    res.send("This is a Login Page");
});


app.get('/weather/:city', async (req, res) => {

    let city = req.params.city;
    if (!city) {
        city = req.query.city;
    }

    let key = 'e41b2d9c8052e5b3df17c1d5e74378e4';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    let response = await fetch(url);
    let weather = await response.json();

    res.render('weather.hbs', {city, weather})
});

app.listen(3000, () => {
    console.log("Приклад додатку прослуховує порт 3000");

});


app.get('/weather', (req, res) => {
    const weather = {
        description: "Clear sky"
    }
    res.render('weather.hbs')
})
