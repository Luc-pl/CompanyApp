const Employee = require('../models/employee.model');

exports.getAll = async (req, res) => {
    try {
        res.json(await Employee.find().populate('department'));
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.getRandom = async (req, res) => {
    try {
        const count = await Employee.countDocuments();
        const rand = Math.floor(Math.random() * count);
        const dep = await Employee.findOne().populate('department').skip(rand);
        if(!dep) res.status(404).json({ message: 'Not found...' });
        else res.json(dep);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const dep = await Employee.getById(req.params.id).populate('department');
        if(!dep) res.status(404).json({ message: 'Not found...' });
        else res.json(dep);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { firstName, lastName, department } = req.body;
        const newEmployee = new Employee({ firstName, lastName, department });
        await newEmployee.save();
        res.json({ message: 'Ok'});
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.editById = async (req, res) => {
    const { firstName, lastName, department } = req.body;
    try {
        const dep = await Employee.findById(req.params.id);
        if(dep) {
            dep.firstName = firstName;
            dep.lastName = lastName;
            dep.department = department;
            await dep.save();
            res.json(dep);
        } else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.deleteById = async (req, res) => {
    try {
      const dep = await Employee.findById(req.params.id);
      if(dep) {
        await Employee.deleteOne({ _id: req.params.id });
        res.json(dep);
      }
      else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }; 