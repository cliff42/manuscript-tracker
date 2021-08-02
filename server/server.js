const express = require('express');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const dbConfig = require('./config/database.config');
const routes = require('./routes/base.route');

const Manuscript = require('./models/Manuscript');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', routes);

mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const port = process.env.PORT || '8000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, function () {
    console.info(`Server is up and running on port ${port}`)
});