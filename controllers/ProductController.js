const { Product } = require("../models/index");

module.exports = class ProductController {
  static async createProducts(req, res) {
    try {
      console.log(req.body);
      const createdProduct = await Product.create(req.body);
      res.status(201).json(createdProduct);
    } catch (err) {
      console.log("error:", err);
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      console.log("error:", err);
    }
  }
};
