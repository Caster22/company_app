const expect = require('chai').expect;
const Department  = require('../department.model');
const mongoose = require('mongoose');

describe('Department', () => {
	afterEach(() => {
		mongoose.models = {};
	});

	it('should throw an Error if no "name" arg', () => {
		const dep = new Department({});

		dep.validate(err => {
			expect(err.errors.name).to.exist;
		});
	});

	it('should throw an Error if "name" is not a string', function () {
		const cases = [{}, []];
		for (let name of cases) {
			const dep = new Department({ name });

			dep.validate(err => {
				expect(err.errors.name).to.exist;
			});
		}
	});

	it('should throw an Error if "name" if its length is lower than 5 and larger than 20', function () {
		const cases = ['max','bigmobydicktesttesttest'];
		for (let name of cases) {
			const dep = new Department({ name });

			dep.validate(err => {
				expect(err.errors.name).to.exist;
			});
		}
	});

	it('should not throw an Error with proper "name" arg', function () {
		const cases = ['Electronics', 'Human Resources', 'maids', 'Catering'];
		for (let name of cases) {
			const dep = new Department({ name });

			dep.validate(err => {
				expect(err).to.not.exist;
			});
		}
	});
});