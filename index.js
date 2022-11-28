'use strict';
const express = require('express');
const morgan = require('morgan');
const protect = require('./src/middlewares/auth');
// const mongoLogger = require('mongoose-morgan');
const app = express();
require('dotenv').config();
const conn = require('./src/config/connectDB');

const error_handler = require('./src/middlewares/error-handler');

//Connecting DB...
conn();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './src/views');

app.get('/', protect, (req, res) => {
    res.render('index.ejs', {
        title: 'Hello world'
    })
})



app.use(morgan('dev'));

//imported routers
const userRoute = require('./src/routes/user');
const listRoute = require('./src/routes/lists');
const taskRoute = require('./src/routes/task');

app.use('/user', userRoute);

app.use('/lists', listRoute);

app.use('/task', taskRoute);



app.use('*', (req, res) => {

    const url = `http://localhost:${process.env.PORT}`

    res.render('PageNotFound.ejs', {
        url: url
    })
});
 
// throw new Error("nimadir hato");

// Error handler
app.use(error_handler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`${port} is being listened...`);
})

