const express = require('express');
const app = express();
const path = require('path');

// resolved path to the base of the compiled client
const publicPath = path.resolve(`${__dirname}/../public`);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
	res.sendFile(`${publicPath}/index.html`);
});

const server = app.listen(4000, () => {
	console.log(`Server started! Listening...`);
});
