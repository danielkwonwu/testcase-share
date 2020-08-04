const express = require('express');
const app = express();
const cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var createError = require('http-errors');
var session = require('express-session');

var userRouter = require('./routes/users');
var testRouter = require('./routes/tests');

console.log("listening");

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }))
app.use(session({
    secret: 'This is a secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false, // for dev purposes, this is false. However, for full build, we need to have this secure flag as true and have communications on https.
        sameSite: 'none'
    }
}));

app.use('/users', userRouter);
app.use('/tests', testRouter);


app.use(function (req, res, next) {
    next(createError(404));
    console.log(req.body.text + " error");
});

app.use(function (err, req, res, next) {
    // send error status and message back to client
    res.status(err.status || 500).json({
        message: err.message
    });
});

app.post('/', (req, res) => {
    console.log(req.body.text);
    res.send('Hello World!')
});

module.exports = app;