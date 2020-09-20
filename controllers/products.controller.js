const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
	try {
		res.json(await Product.find());
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getById = async (req, res) => {
	try {
		const prod = await(Product.findById(req.params.id));
		if (!prod) res.status(404).json({ message: 'Not found' });
		else res.json(prod);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.postNew = async (req, res) => {
	const { name, client } = req.body;

	try{
		const newProd = new Product({ name: name, client: client});
		await newProd.save();
		res.json({ message: 'OK' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.updateById = async (req, res) => {
	const { name, client } = req.body;

	try{
		const prod = await(Product.findById(req.params.id));
		if (prod) {
			await Product.updateOne({ _id: req.params.id}, { $set: { name: name, client: client} });
			res.json({ message: 'OK' });
		}else res.status(404).json({ message: 'Not found' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.removeById = async (req, res) => {
	const prod = await(Product.findById(req.params.id));
	try {
		if (prod) {
			await prod.remove();
			res.json({ message: 'OK' });
		} else res.status(404).json({ message: 'Not found' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};