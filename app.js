const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const { sequelize } = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

const app = express();

passportConfig();

const userRoute = require('./routes/user');
const drugRoute = require('./routes/drug');
const prscRoute = require('./routes/prsc');
const pageRoute = require('./routes/page');
const mydrugRoute = require('./routes/mydrug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET))
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }),
};

sequelize.sync({ force: false }).
    then(() => {
        console.log('데이터베이스 연결 성공');
    }).catch(err => {
        console.log('연결 실패', err);
    });

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

app.use(session(sessionOption));
app.use(passport.initialize()); // 요청(req)에 passport 설정을 심는다.
app.use(passport.session()); // req.session 객체에 passport 정보를 저장한다.

app.use('/user', userRoute);
app.use('/drug', drugRoute);
app.use('/prsc', prscRoute);
app.use('/page', pageRoute);
app.use('/mydrug', mydrugRoute);

app.use(function (req, res, next) {
    res.status(404);
    res.json({
        message: '서버 오류 발생 from app.js'
    });
});

module.exports = app;