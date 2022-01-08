const expect = require('chai').expect;
const Employees = require('../employees.model.js');
const mongoose = require('mongoose');

describe('Employees', () => {
    after(() => {
        mongoose.models = {};
    });
    it('should throw an error if any arg is missing', () => {
        const cases = [
          {
            firstName: 'John',
            lastName: 'Doe'
          },
          {
            firstName: 'John',
            department: 'Marketing'
          },
          {
            lastName: 'Doe',
            department: 'Marketing'
          }
        ];
    
        for (let prop of cases) {
            const emp = new Employees(prop);
    
            emp.validate(err => {
            expect(err.errors).to.exist;
            });
        }
      });
    
    it('should throw an error if "firstName" is not a string', () => {
    
        const cases = [{}, []];
        for (let firstName of cases) {
          const emp = new Employees({ firstName, lastName: 'Doe', department: 'Marketing'});
    
          emp.validate(err => {
            expect(err.errors.firstName).to.exist;
          });
        }
    });
    
    it('should throw an error if "lastName" is not a string', () => {
    
        const cases = [{}, []];
        for (let lastName of cases) {
          const emp = new Employees({ lastName, firstName: 'John', department: 'Marketing' });
    
          emp.validate(err => {
            expect(err.errors.lastName).to.exist;
          });
        }
    });
    
    it('should throw an error if "department" is not a string', () => {
    
        const cases = [{}, []];
        for (let department of cases) {
          const emp = new Employees({ department, lastName: 'John', firstName: 'John' });
    
          emp.validate(err => {
            expect(err.errors.department).to.exist;
          });
        }
    });
    
    it('should not throw an error when properties are correct', () => {
        const emp = new Employees({firstName: 'John', lastName: 'Doe', department: 'Marketing'});
    
        emp.validate(err => {
          expect(err).to.not.exist;
        });
    });
});