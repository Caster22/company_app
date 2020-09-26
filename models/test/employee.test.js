const expect = require('chai').expect;
const Employee  = require('../emploee.model');
const mongoose = require('mongoose');

describe('Employee', () => {
	afterEach(() => {
		mongoose.models = {};
	});

	it('should throw an Error if any of args wasn\'t provided', () => {
		const emp = new Employee({});

		emp.validate(err => {
			expect(err.errors).to.exist;
		});
	});

	it('should throw an Error if args have wrong type', function () {
		const cases = [{}, []];
		for (let firstName of cases) {
			for (let lastName of cases) {
				for (let department of cases) {
					for (let salary of cases) {
						const dep = new Employee({ firstName, lastName, department, salary });

						dep.validate(err => {
							expect(err.errors).to.exist;
						});
					}
				}
			}
		}
	});

	it('should not throw an Error with proper args', function () {
		const casesString = ['firstName', 'lastName', 'department', 'salary'];
		const casesNumber = [1000, 2000, 3000, 4000, 5000];
		for (let firstName of casesString) {
			for (let lastName of casesString) {
				for (let department of casesString) {
					for (let salary of casesNumber) {
						const dep = new Employee({ firstName, lastName, department, salary });

						dep.validate(err => {
							expect(err).to.not.exist;
						});
					}
				}
			}
		}
	});
});