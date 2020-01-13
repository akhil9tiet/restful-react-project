const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
	`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-dssse.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
	{ useUnifiedTopology: true, useNewUrlParser: true }
	// ,
	// {
	// 	useMongoClient:true
	// }
);

mongoose.Promise = global.Promise; //use default nodejs promise implementation instead of the monngose one

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); //this is to make the uploads folder available statically
app.use(bodyParser.urlencoded({ extended: false })); //extended true will help parse extended bodies which rich data in it
app.use(bodyParser.json()); //extract json data and make it easy for us to read

//prevent CORS errors when we connect single page application or some other client to our API
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); //response header we add header and the first header allows which will cancel the cors error which said no access control allowed at origin, * gives access to any origin
	res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method === 'OPTIONS') {
		//Browser will always send an OIPTIONS request first when you send a POST request or a PUT request
		res.header('Access-Control-Allow-Methods', 'PUST, POST, PATCH, DELETE, GET'); // we tell the browser what it might send...basically all the HTTP verbs we want to support with our API
		return res.status(200).json({});
	}
	next();
});

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
