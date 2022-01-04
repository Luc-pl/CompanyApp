const Product = require('../models/product.model');

exports.getAll = async (req, res) => {
    try {
        res.json(await Product.find());
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.getRandom = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        const rand = Math.floor(Math.random() * count);
        const dep = Product.findOne().skip(rand);
        if(!dep) res.status(404).json({ message: 'Not found...' });
        else res.json(dep);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.getById = async (req, res) => {
    try {
        const dep = Product.getById(req.params.id);
        if(!dep) res.status(404).json({ message: 'Not found...' });
        else res.json(dep);
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.addDepartment = async (req, res) => {
    try {
        const { name, client } = req.body;
        const newProduct = new Product({ name, client });
        await newProduct.save();
        res.json({ message: 'Ok'});
    }
    catch(err) {
        res.status(500).json({ message: err });
    }
};

exports.editById = async (req, res) => {
    const { name, client } = req.body;
    try {
        const dep = await Productt.findById(req.params.id);
        if(dep) {
            dep.name = name;
            dep.client = client;
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
      const dep = await Product.findById(req.params.id);
      if(dep) {
        await Product.deleteOne({ _id: req.params.id });
        res.json(dep);
      }
      else res.status(404).json({ message: 'Not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }; 