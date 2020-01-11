const express = require('express');

const app = express();

app.use((req, res, next) => {
	res.status(200).json({
		message: 'it works'
	});
}); //sets up a middleware so incoming request has to go through app.use and things we pass through it

module.exports = app;
