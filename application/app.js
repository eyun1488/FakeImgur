var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import express handlebars
var handlebars = require('express-handlebars');
var sessions = require('express-session');
var flash = require('express-flash');
var mysqlSession = require('express-mysql-session')(sessions);
var multer = require('multer');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbRouter = require('./routes/dbtest');
var postRouter = require('./routes/post');

var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var successPrint = require('./helpers/debug/debugprinters').successPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;

var app = express();

app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0)
            }
            // renderLink: () => {
            // }
            /**
             * if you need more helpers, you can 
             * register them here.
             */
        },
    })
);

var mysqlSessionStore = new mysqlSession(
    {
        /* using default options */
    },
    require('./conf/database')
);


app.use(sessions({
    key: "csid",
    secret: "this is a secret from csc317",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
// set the engine
app.set("view engine", "hbs");
// code below is unmounted middleware functions
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, 'public')));

// this is not a terminating middleware function therefore you must call next(); or it'll hang
app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use((req, res, next) => {
    console.log(req.session);
    if (req.session.username) {
        res.locals.logged = true;
    }
    next();
});

// these are mounted middleware functions 
app.use('/', indexRouter);
// add path to dbRouter
app.use('/dbtest', dbRouter);
// this will only run on the /users path
app.use('/users', usersRouter);
// adding post routes
app.use('/post', postRouter);


// the way express knows that a function is a middleware is by the parameters (or the need for them)
app.use((err, req, res, next) => {
    res.status(500);
    console.log(err);
    // res.send('something went wrong with your db.');
    res.render("error", { err_message: err });
});

module.exports = app;
