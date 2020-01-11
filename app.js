const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

//Routes which should handle routes
app.use('/products', productRoutes); //sets up a middleware so incoming request has to go through app.use and things we pass through it
app.use('/orders', orderRoutes);

//if you reach here it means that any of the above two routes was able to handle the request
app.use((req, res, next) => {
	const error = new Error('Not Found!');
	error.status = 404;
	next(error); //forward this error request
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	});
});

module.exports = app;
