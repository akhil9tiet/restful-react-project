const express = require('express');
const app = express();

const productRoutes= require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');

app.use('/products', productRoutes); //sets up a middleware so incoming request has to go through app.use and things we pass through it
app.use('/orders', orderRoutes);

module.exports = app;
