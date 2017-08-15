const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const connection = require('./db/connection');
const bookRouter = require('./route/book');
const memberRouter = require('./route/member');
const checkOutRouter = require('./route/checkOut');

connection.initialize();

// resolved path to the base of the compiled client
const publicPath = path.resolve(`${__dirname}/../public`);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(publicPath));

app.use('/api/books', bookRouter);
app.use('/api/members', memberRouter);
app.use('/api/checkOut', checkOutRouter);

app.get('*', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

const server = app.listen(4000, () => {
	console.log(`Server started! Listening...`);
});
