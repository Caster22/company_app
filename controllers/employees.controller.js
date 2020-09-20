const Employee = require('../models/emploee.model');

exports.getAll = async (req, res) => {
	try {
		res.json(await Employee.find().populate('department'));
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getRandom = async (req, res) => {
	try {
		const count = await Employee.countDocuments();
		const rand = Math.floor(Math.random() * count);
		const emp = await Employee.findOne().populate('department').skip(rand);
		if (!emp) res.status(404).json({ message: 'Not found' });
		else res.json(emp);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.getById = async (req, res) => {
	try {
		const dep = await Employee.findById(req.params.id).populate('department');
		if (!dep) res.status(404).json({ message: 'Not found' });
		else res.json(dep);
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.postNew = async (req, res) => {
	const { firstName, lastName, department, salary } = req.body;

	try {
		const newEmp = new Employee({ firstName: firstName, lastName: lastName, department: department, salary: salary });
		await newEmp.save();
		res.json({ message: 'OK' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.updateById = async (req, res) => {
	const { firstName, lastName, department, salary } = req.body;

	try {
		const dep = await(Employee.findById(req.params.id));
		if (dep) {
			await Employee.updateOne({ _id: req.params.id}, { $set: { firstName: firstName, lastName: lastName, department: department, salary: salary } });
			res.json({ message: 'OK' });
		} else {
			res.status(404).json({ message: 'Not found' });
		}
	} catch (err) {
		res.status(500).json({ message: err });
	}
};

exports.removeById = async (req, res) => {
	try {
		const dep = await(Employee.findById(req.params.id));
		if (dep) {
			await Employee._deleteOne({ _id: req.params.id});
			res.json({ message: 'OK' });
		} else res.status(404).json({ message: 'Not found' });
	} catch (err) {
		res.status(500).json({ message: err });
	}
};