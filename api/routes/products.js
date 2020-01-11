const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'handling GET requests to /products'
	});
}); //handles incoming get request

router.post('/', (req, res, next) => {
	res.status(200).json({
		message: 'handling POST requests to /products'
	});
}); //handles incoming get request

router.get('/:productId', (req, res, next) => {
	const id = req.params.productId;
	if (id === 'special') {
		res.status(200).json({
			message: `You discovered: special`,
			id: id
		});
	} else {
		res.status(200).json({
			message: 'You passed an ID'
		});
	}
});

router.patch('/:productId', (req, res, next) => {
	res.status(200).json({
    message: 'Updated product!'
  })
});

router.delete('/:productId', (req, res, next) => {
	res.status(200).json({
		message: 'Deleted product!'
	});
});




module.exports = router;
