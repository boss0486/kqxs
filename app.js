var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// logger
const HelperLogger = require('./helper/helper.logger');
// *****************************************************
// api router 
var authenRouter = require('./routes/authen');
var userRouter = require('./routes/user');
var areaRouter = require('./routes/area');
var boso_categoryRouter = require('./routes/boso_category');
var bosoRouter = require('./routes/boso');
var buy_historyRouter = require('./routes/buy_history');
var kqxs_categoryRouter = require('./routes/kqxs_category');
var kqxsRouter = require('./routes/kqxs');
var provinceRouter = require('./routes/province');
var orderRouter = require('./routes/order');
var matchedRouter = require('./routes/kq_matched');
var serviceRouter = require('./routes/service');

// html router
var indexHtmlRouter = require('./routes/html/html_index');
var bosoCategoryHtmlRouter = require('./routes/html/html_boso_category');
var bosoHtmlRouter = require('./routes/html/html_boso');
var orderHtmlRouter = require('./routes/html/html_order');

// ***************************************************************************************
var app = express();
const connectDatabase = require("./config/db.config");
connectDatabase();
// ***************************************************************************************
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/public', express.static(__dirname + 'public'));
// view engine setup
const expresslayouts = require('express-ejs-layouts');
app.use(expresslayouts);
app.set('layout', './layouts/_layout');
app.set('view engine', 'ejs');

// ***************************************************************************************
var session = require('express-session');
var MemoryStore = require('memorystore')(session);
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'login',
    cookie: { maxAge: 3600000 },
    store: new MemoryStore({
        checkPeriod: 3600000 // prune expired entries every 24h
    }),
    resave: false,
    expires: new Date(Date.now() + 3600000)
}));

//
const Notyfication = require("./helper/helper.notification");
// ***************************************************************************************
// authentication all aplication
const apiAuthen = require("./helper/security.authen");
// app.use(apiAuthen);
//
// ***************************************************************************************
// use html page
//app.use(express.static('/', { index: 'login' }))
app.use(`/api-2021-${process.env.API_SECRET}/authen/`, authenRouter);
app.use('/authen/', authenRouter);
app.use(apiAuthen);

app.use('/', indexHtmlRouter);
app.use('/backend/boso/', bosoHtmlRouter);
app.use('/backend/boso-category/', bosoCategoryHtmlRouter);
app.use('/backend/order/', orderHtmlRouter);


//use api  
app.use(`/api-2021-${process.env.API_SECRET}/user/`, userRouter);
app.use(`/api-2021-${process.env.API_SECRET}/area-geographical/`, areaRouter);
app.use(`/api-2021-${process.env.API_SECRET}/boso-cate/`, boso_categoryRouter);
app.use(`/api-2021-${process.env.API_SECRET}/boso/`, bosoRouter);
app.use(`/api-2021-${process.env.API_SECRET}/buy-history/`, buy_historyRouter);
app.use(`/api-2021-${process.env.API_SECRET}/kqxs-cate/`, kqxs_categoryRouter);
app.use(`/api-2021-${process.env.API_SECRET}/kqxs/`, kqxsRouter);
app.use(`/api-2021-${process.env.API_SECRET}/province/`, provinceRouter);
app.use(`/api-2021-${process.env.API_SECRET}/order/`, orderRouter);
app.use(`/api-2021-${process.env.API_SECRET}/matched/`, matchedRouter);
app.use(`/api-2021-${process.env.API_SECRET}/service/`, serviceRouter);
//app.use(apiAuthen);
// catch 404 and forward to error handler
app.use(async(req, res, next) => {
    // logger file 
    HelperLogger.logged(`404: ${req.originalUrl}`);
    // *************************************************************************************************
    if (req.originalUrl.includes(`/api-2021-${process.env.API_SECRET}`)) {
        return res.json(await Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_BAD_REQUEST));
    } else {
        return res.render('404', { layout: "./layouts/_blank", title: "404: Page not found!" });
    }
});

// error handler
app.use(async(err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // logger file 
    HelperLogger.logged(`${err.status}: ${err.message}`);
    // *************************************************************************************************
    res.status(err.status || 500);
    if (req.originalUrl.includes(`/api-2021-${process.env.API_SECRET}`)) {
        res.json(await Notyfication.invalid(Notyfication.httMessage.NOTIFY_MESSAGE_SERVICE_UNAVAILABLE));
        return;
    }
    //
    else {
        res.render('503', { layout: "./layouts/_blank", title: "503: Not service" });
        return;
    }
});

module.exports = app;