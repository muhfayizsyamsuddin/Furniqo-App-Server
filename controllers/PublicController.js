const { Product } = require("../models/index");

module.exports = class PublicController {
  static async publicGetProducts(req, res, next) {
    try {
      const products = await Product.findAll();
      res.status(200).json(products);
    } catch (err) {
      // console.log("error:", err);
      next(err);
    }
  }

  static async pubDetailProductsById(req, res, next) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);
      if (!products) {
        // res.status(404).json({ message: `error not found` });
        // return;
        throw { name: "NotFound", message: "Product not found" };
      }
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }
};
