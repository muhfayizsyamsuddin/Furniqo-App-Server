const { Product } = require("../models/index");

module.exports = class PublicController {
  static async publicGetProducts(req, res) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (err) {
      console.log("error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async pubDetailProductsById(req, res) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);
      if (!products) {
        res.status(404).json({ message: `error not found` });
        return;
      }
      res.status(200).json(products);
    } catch (err) {
      console.log("error:", err);
    }
  }
};
