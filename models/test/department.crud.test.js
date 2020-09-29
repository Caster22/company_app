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

	describe('Creating data', () => {
		it('should should insert new document with "insertOne" method', async function () {
			const department = new Department({ name: 'Department #1'});
			await department.save();
			expect(department.isNew).to.be.false;
		});

		after(async () => {
			await Department.deleteMany();
		});
	});

	describe('Updating data', () => {
		beforeEach(async () => {
			const testDepOne = new Department({ name: 'Department #1' });
			await testDepOne.save();

			const testDepTwo = new Department({ name: 'Department #2' });
			await testDepTwo.save();
		});

		afterEach(async () => {
			await Department.deleteMany();
		});

		it('should properly update one document with "updateOne" method' ,async function () {
			await Department.updateOne({ name: 'Department #1' }, { $set: { name: '=Department #1=' }});
			const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
			expect(updatedDepartment).to.not.be.null;
		});

		it('should properly update one document with "save" method',async function () {
			const department = await Department.findOne({ name: 'Department #1' });
			department.name = '=Department #1=';
			await department.save();
			//Or:
			//const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
			//expect(updatedDepartment).to.not.be.null;
			expect(department.isNew).to.be.false;
		});

		it('should properly update multiple documents with "updateMany" method',async function () {
			await Department.updateMany({}, {$set: { name: 'UpdateMany' }});
			const updDepartments = await Department.find();
			expect(updDepartments[0].name).to.be.equal('UpdateMany');
			expect(updDepartments[1].name).to.be.equal('UpdateMany');
		});
	});

	describe('Removing data', () => {
		beforeEach(async () => {
			const testDepOne = new Department({ name: 'Department #1' });
			await testDepOne.save();

			const testDepTwo = new Department({ name: 'Department #2' });
			await testDepTwo.save();
		});

		afterEach(async () => {
			await Department.deleteMany();
		});

		it('should  properly remove one document with "deleteOne" method',async function () {
			await Department.deleteOne({ name: 'Department #1' });
			const deletedDepartment = await  Department.findOne({ name: 'Department #1' });
			expect(deletedDepartment).to.be.null;
		});

		it('should  properly remove one document with "remove" method',async function () {
			const department = await Department.findOne({ name: 'Department #1' });
			await department.remove();
			const removedDepartment = await Department.findOne({ name: 'Department #1' });
			expect(removedDepartment).to.be.null;
		});

		it('should  properly remove multiple documents with "deleteMany" method',async function () {
			await Department.deleteMany();
			const deletedDeparts  = await Department.find();
			expect(deletedDeparts.length).to.be.equal(0);
		});
	});
	after(async () => {
		mongoose.connection.close();
	});
});