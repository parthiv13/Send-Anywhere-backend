const express = require('express'),
app = express(),
uuid = require('uuid/v4'),
morgan = require('morgan'),
logger = require('./config/winston'),
device = require('express-device'),
cors = require('cors'),
session = require('express-session'),
FileStore = require('session-file-store')(session),
{ secret } = require('./config/config'),
bodyParser = require('body-parser');

require('./config/passport')(passport);

app.use(morgan('dev', { "stream": logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(device.capture());
app.use(cors());

app.use(session({
    genid: (req) => {
        logger.info(req.sessionID);
        return uuid();
    },
    store: new FileStore(),
    secret: secret,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', (req, res) => {
    res.send('Heya!' + req.device.type.toUpperCase());
});

app.listen(8080, () => {
    console.log('http://localhost:8080');
})