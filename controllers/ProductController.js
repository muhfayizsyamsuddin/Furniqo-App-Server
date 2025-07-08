const { Product, User } = require("../models/index");

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
      const products = await Product.findAll({
        include: {
          model: User,
          attributes: [
            "id",
            "username",
            "email",
            "role",
            "phoneNumber",
            "address",
          ],
        },
      });
      res.status(200).json(products);
    } catch (err) {
      console.log("error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async detailProductsById(req, res) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);
      if (!products) {
        res.status(404).json({ message: `Product ${productId} not found` });
        return;
      }
      res.status(200).json(products);
    } catch (err) {
      console.log("error:", err);
    }
  }

  static async updateProductsById(req, res) {
    const productId = req.params.id;
    try {
      const product = await Product.findByPk(productId);
      console.log(product, "<---");

      if (!product) {
        res.status(404).json({ message: `Product ${productId} not found` });
        return;
      }
      await product.update(req.body);
      //   await Product.update({ where: { id: productId } });
      res.status(200).json({ message: `Product updated seccesfully` });
    } catch (err) {
      console.log("error:", err);
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async deleteProductsById(req, res) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);

      if (!products) {
        res.status(404).json({ message: `Product ${productId} not found` });
        return;
      }
      await Product.destroy({ where: { id: productId } });
      res
        .status(200)
        .json({ message: `Product ${productId} deleted seccesfully` });
    } catch (err) {
      console.log("error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // static async publicGetProducts(req, res) {
  //   try {
  //     const products = await Product.findAll();
  //     res.status(200).json(products);
  //   } catch (err) {
  //     console.log("error:", err);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // }

  // static async pubDetailProductsById(req, res) {
  //   const productId = req.params.id;
  //   try {
  //     const products = await Product.findByPk(productId);
  //     if (!products) {
  //       res.status(404).json({ message: `error not found` });
  //       return;
  //     }
  //     res.status(200).json(products);
  //   } catch (err) {
  //     console.log("error:", err);
  //   }
  // }
};
