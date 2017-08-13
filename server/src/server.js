const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const connection = require('./db/connection');
const bookRouter = require('./route/book');
const memberRouter = require('./route/member');

connection.initialize();

// resolved path to the base of the compiled client
const publicPath = path.resolve(`${__dirname}/../public`);

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(publicPath));

app.get('*', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

app.use('/books', bookRouter);
app.use('/member', memberRouter);

const server = app.listen(4000, () => {
	console.log(`Server started! Listening...`);
});
