const path = require('path');
const express = require('express');
const app = express();
const port = 8004;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.basedir = app.get('views');

app.get('/', (req, res) => {
  res.render('pages/home');
});

app.get('/about', (req, res) => {
    res.render('pages/about')
})

app.get('/detail/:', (req, res) => {
    res.render('pages/detail')
})

app.get('/collections', (req, res) => {
    res.render('pages/collections')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
