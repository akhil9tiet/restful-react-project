const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Product.find()
		.exec()
		.then((docs) => {
			console.log(docs);
			if (docs.length > 0) { //check to prevent return of an empty products array
				res.status(200).json(docs);
			} else {
				res.status(404).json({ message: 'No entries found' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
}); //handles incoming get request

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product
		.save() //save is a function provided by mongoose which will store the object in the database
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: 'handling POST requests to /products',
				createdProduct: result
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});

	res.status(201).json({
		message: 'handling POST requests to /products',
		createdProduct: product
	});
}); //handles incoming get request

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.exec()
		.then((doc) => {
			console.log(doc);

			if (doc) {
				res.status(200).json(doc);
			} else {
				res.status(404).json({ message: 'No valid entry found for the provided ID' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.patch('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'Updated product!'
	});
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json(result);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
