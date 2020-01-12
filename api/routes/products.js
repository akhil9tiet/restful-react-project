const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
	Product.find()
		.select('name price_id')
		.exec()
		.then((docs) => {
			// console.log(docs);
			const response = {
				count: docs.length,
				products: docs.map((doc) => {
					return {
						name: doc.name,
						price: doc.price,
						_id: doc._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + doc._id
						}
					};
				})
			};
			if (docs.length > 0) {
				//check to prevent return of an empty products array
				res.status(200).json(response);
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
				message: 'Created product successfully',
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: 'GET',
						url: 'http://localhost:3000/products/' + result._id
					}
				}
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
		.select('name price _id')
		.exec()
		.then((doc) => {
			console.log(doc);

			if (doc) {
				res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'GET_ALL_PRODUCTS',
            url: 'http://localhost:3000/products'
          }
        });
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
	const id = req.params.productId;
	const updateOps = {};
	for (const ops of req.body) {
		//dynamic way to send patch request which will handle the three scenarios when user doesnot want to update anything, wants to update name or wants to update the price
		updateOps[ops.propName] = ops.value;
	}
	Product.update({ _id: id }, { $set: updateOps })
		.exec()
		.then((result) => {
			res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products'+id
        }
      });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

router.delete('/:productId', (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then((result) => {
			res.status(200).json({
        message: 'Product deleted',
        request:{
          type: 'POST',
          url:'http://localhost:3000/products',
          body: {name: 'String', price: 'Number'}
        }
      });
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: err });
		});
});

module.exports = router;
