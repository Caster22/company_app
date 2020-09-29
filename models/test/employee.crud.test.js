const Employee = require('../emploee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Employee', () =>{
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
			const testEmpOne = new Employee({
				firstName: 'Employee #1',
				lastName: 'Employee worker #1',
				department: 'Department #1',
				salary: 2000
			});
			await testEmpOne.save();

			const testEmpTwo = new Employee({
				firstName: 'Employee #2',
				lastName: 'Employee worker #2',
				department: 'Department #2',
				salary: 5000
			});
			await testEmpTwo.save();
		});

		it('should return all the data with "find" method', async () => {
			const employees = await Employee.find();
			const expectLength = 2;

			expect(employees.length).to.be.equal(expectLength);
		});

		it('should return a proper document by "name" with "findOne" method', async () => {
			const employee = await Employee.findOne({ firstName: 'Employee #1' });
			const expectedDoc = 'Employee #1';
			expect(employee.firstName).to.be.equal(expectedDoc);
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});

	describe('Creating data', () => {
		it('should should insert new document with "insertOne" method', async function () {
			const employee = new Employee({
				firstName: 'Employee #1',
				lastName: 'Employee worker #1',
				department: 'Department #1',
				salary: 2000
			});
			await employee.save();
			expect(employee.isNew).to.be.false;
		});

		after(async () => {
			await Employee.deleteMany();
		});
	});

	describe('Updating data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({
				firstName: 'Employee #1',
				lastName: 'Employee worker #1',
				department: 'Department #1',
				salary: 2000
			});
			await testEmpOne.save();

			const testEmpTwo = new Employee({
				firstName: 'Employee #2',
				lastName: 'Employee worker #2',
				department: 'Department #2',
				salary: 5000
			});
			await testEmpTwo.save();
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});

		it('should properly update one document with "updateOne" method' ,async function () {
			await Employee.updateOne({ firstName: 'Employee #1' }, { $set: { firstName: '=Employee #1=' }});
			const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
			expect(updatedEmployee).to.not.be.null;
		});

		it('should properly update one document with "save" method',async function () {
			const employee = await Employee.findOne({ firstName: 'Employee #1' });
			employee.firstName = '=Employee #1=';
			await employee.save();
			//Or:
			//const updatedEmployee = await Employee.findOne({ firstName: '=Employee #1=' });
			//expect(updatedEmployee).to.not.be.null;
			expect(employee.isNew).to.be.false;
		});

		it('should properly update multiple documents with "updateMany" method',async function () {
			await Employee.updateMany({}, {$set: { firstName: 'UpdateMany' }});
			const updEmployee = await Employee.find();
			expect(updEmployee[0].firstName).to.be.equal('UpdateMany');
			expect(updEmployee[1].firstName).to.be.equal('UpdateMany');
		});
	});

	describe('Removing data', () => {
		beforeEach(async () => {
			const testEmpOne = new Employee({
				firstName: 'Employee #1',
				lastName: 'Employee worker #1',
				department: 'Department #1',
				salary: 1000
			});
			await testEmpOne.save();

			const testEmpTwo = new Employee({
				firstName: 'Employee #2',
				lastName: 'Employee worker #2',
				department: 'Department #2',
				salary: 5000
			});
			await testEmpTwo.save();
		});

		afterEach(async () => {
			await Employee.deleteMany();
		});

		it('should  properly remove one document with "deleteOne" method',async function () {
			await Employee.deleteOne({ firstName: 'Employee #2' });
			const deletedEmployee = await  Employee.findOne({ firstName: 'Employee #2' });
			expect(deletedEmployee).to.be.null;
		});

		it('should  properly remove one document with "remove" method',async function () {
			const employee = await Employee.findOne({ firstName: 'Employee #2' });
			await employee.remove();
			const removedEmployee = await Employee.findOne({ firstName: 'Employee #2' });
			expect(removedEmployee).to.be.null;
		});

		it('should  properly remove multiple documents with "deleteMany" method',async function () {
			await Employee.deleteMany();
			const deletedEmp  = await Employee.find();
			expect(deletedEmp.length).to.be.equal(0);
		});
	});
});