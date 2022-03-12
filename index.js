const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");
const cors = require('cors');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT} = require('./config/config');

const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoutes');

let RedisStore = require("connect-redis")(session)
let redisClient = redis.createClient({
    legacyMode: true,
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
});
redisClient.connect().catch(console.error);

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose
    .connect(mongoURL)
    .then(() => console.log('Successfully connected to database'))
    .catch((e) => console.log(e));

app.enable('trust proxy');
app.use(cors({}));
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000
            // * 60
            * 30
    }
}));

app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.send("<h2>Hi there!</h2>");
    console.log('vik IT WORKS!');
});
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => console.log(`Listen on port ${PORT}`));
