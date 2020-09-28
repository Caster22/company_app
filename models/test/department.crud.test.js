
const Department = require('../department.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Department', () => {
	before(async () => {

		try {
			const fakeDB = new MongoMemoryServer();

			const uri = await fakeDB.getUri();

			mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

		} catch(err) {
			console.log(err);
		}

	});

	describe('Reading data', () => {

		before(async () => {
			const testDepOne = new Department({ name: 'Department #1' });
			await testDepOne.save();

			const testDepTwo = new Department({ name: 'Department #2' });
			await testDepTwo.save();
		});

		it('should return all the data with "find" method', async () => {
			const departments = await Department.find();
			const expectLength = 2;

			expect(departments.length).to.be.equal(expectLength);
		});

		it('should return a proper document by "name" with "findOne" method', async () => {
			const department = await Department.findOne({ name: 'Department #1' });
			const expectedName = 'Department #1';
			expect(department.name).to.be.equal(expectedName);
		});

		after(async () => {
			await Department.deleteMany();
		});
	});
});