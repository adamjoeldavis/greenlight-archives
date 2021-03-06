const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// resolved path to the base of the compiled client
const publicPath = path.resolve(`${__dirname}/../public`);

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static(publicPath));

// make sure this route is the last one in the list, or else API calls will not work
app.get('*', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

const server = app.listen(4000, () => {
	console.log(`Server started! Listening...`);
});
