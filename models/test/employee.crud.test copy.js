const Employeess = require('../Employeess.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employeess', () => {

  before(async () => {

    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', { useNewUrlParser: true, useUnifiedTopology: true });
      } catch(err) {
        console.error(err);
      }
  });

  describe('Reading data', () => {
    let depId;
    before(async () => {
      const testDep = new Department({ name: 'Testing '});
      const savedDep = await testDep.save();
      depId = savedDep._id;

      const testEmpOne = new Employees({ firstName: 'Employees #1', lastName: 'Test1', department: depId });
      await testEmpOne.save();

      const testEmpTwo = new Employees({ firstName: 'Employees #2', lastName: 'Test2', department: depId });
      await testEmpTwo.save();
    });

    after(async () => {
      await Employees.deleteMany();
      await Department.deleteMany();
    });

    it('should return all the data with "find" method', async () => {
      const Employeess = await Employees.find();
      const expectedLength = 2;
      expect(Employeess.length).to.be.equal(expectedLength);
    });

    it('should contain department document after populate method', async () => {
        const Employeess = await Employees.find().populate('department');
        for (emp of Employeess) {
          emp.department.validate(err => {
            expect(err).to.not.exist;
          });
        }
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const expectedEmployees = { firstName: 'Employees #1', lastName: 'Test1', department: depId};
      for (let key in expectedEmployees) {
        const value = expectedEmployees[key];
        const Employees = await Employees.findOne({ [key]: value });
        expect(Employees.firstName).to.be.equal(expectedEmployees.firstName);
      }
    });
  });

  describe('Creating data', () => {
    after(async () => {
      await Employees.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const Employees = new Employees({ firstName: 'Employees #1', lastName: 'Test', department: 'Test' });
      await Employees.save();
      expect(Employees.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employees({ firstName: 'Employees #1', lastName: 'Test', department: 'Test' });
      await testEmpOne.save();

      const testEmpTwo = new Employees({ firstName: 'Employees #2', lastName: 'Test', department: 'Test' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employees.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employees.updateOne({ firstName: 'Employees #1' }, { $set: { firstName: '=Employees #1=' } });
      const updatedEmployees = await Employees.findOne({ firstName: '=Employees #1=' });
      expect(updatedEmployees).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const Employees = await Employees.findOne({ firstName: 'Employees #1' });
      Employees.firstName = '=Employees #1=';
      await Employees.save();

      const updatedEmployees = await Employees.findOne({ firstName: '=Employees #1=' });
      expect(updatedEmployees).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employees.updateMany({}, { $set: { firstName: 'Updated Employees' } });
      const updatedEmps = await Employees.find({ firstName: 'Updated Employees' });
      expect(updatedEmps.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employees({ firstName: 'Employees #1', lastName: 'Test', department: 'Test' });
      await testEmpOne.save();

      const testEmpTwo = new Employees({ firstName: 'Employees #2', lastName: 'Test', department: 'Test' });
      await testEmpTwo.save();
    });

    afterEach(async () => {
      await Employees.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employees.deleteOne({ firstName: 'Employees #1' });
      const emp = await Employees.findOne({ firstName: 'Employees #1' });
      expect(emp).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const Employees = await Employees.findOne({ firstName: 'Employees #1' });
      await Employees.remove();
      const removedEmployees = await Employees.findOne({ firstName: 'Employees #1' });
      expect(removedEmployees).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employees.deleteMany();
      const Employeess = await Employees.find();
      expect(Employeess.length).to.equal(0);
    });
  });
  
});