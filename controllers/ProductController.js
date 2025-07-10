const { Product, User } = require("../models/index");
// import { v2 as cloudinary } from "cloudinary";
const { v2: cloudinary } = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// cloudinary.config({
//   cloud_name: "dmtfulhtw",
//   api_key: "567286987943313",
//   api_secret: "l_KVcBfRr-gifNXNaJRPtjpelA8",
// });

module.exports = class ProductController {
  static async updateProductCoverUrlById(req, res, next) {
    // req.file=
    // {
    //   fieldname: 'imageUrl',
    //   originalname: 'my com.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg',
    //   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 01 00 48 00 48 00 00 ff db 00 43 00 06 04 05 06 05 04 06 06 05 06 07 07 06 08 0a 10 0a 0a 09 09 0a 14 0e 0f 0c ... 30803 more bytes>,
    //   size: 30853
    // }
    console.log(req.file, "<==== rf");
    const mimetype = req.file.mimetype;
    const base64File = req.file.buffer.toString("base64");
    try {
      const productId = req.params.id;
      const product = await Product.findByPk(productId);
      if (!product) {
        throw { name: "NotFound", message: "Product not found" };
      }
      // Upload an image
      const uploadResult = await cloudinary.uploader.upload(
        `data:${mimetype};base64,${base64File}`,
        {
          public_id: req.file.originalname,
          folder: "p3-ikea",
        }
      );

      await product.update({ imageUrl: uploadResult.secure_url });

      res.json({ message: "Cover url has been updated" });
    } catch (err) {
      next(err);
    }
  }

  static async createProducts(req, res, next) {
    try {
      // console.log(req.body);
      const createdProduct = await Product.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        authorId: req.user.id,
      });
      res.status(201).json(createdProduct);
    } catch (err) {
      // console.log("error:", err);
      next(err);
      // if (err.name === "SequelizeValidationError") {
      //   res.status(400).json({ message: err.errors[0].message });
      // } else {
      //   res.status(500).json({ message: "Internal Server Error" });
      // }
    }
  }

  static async getProducts(req, res, next) {
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
      // console.log("error:", err);
      next(err);
    }
  }

  static async detailProductsById(req, res, next) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);
      if (!products) {
        // res.status(404).json({ message: `Product ${productId} not found` });
        // return;
        throw { name: "NotFound", message: "Product not found" };
      }
      res.status(200).json(products);
    } catch (err) {
      // console.log("error:", err);
      next(err);
    }
  }

  static async updateProductsById(req, res, next) {
    const productId = req.params.id;
    try {
      const product = await Product.findByPk(productId);
      // console.log(product, "<---");

      if (!product) {
        // res.status(404).json({ message: `Product ${productId} not found` });
        // return;
        throw { name: "NotFound", message: "Product not found" };
      }
      await product.update(req.body, { validate: true });
      //   await Product.update({ where: { id: productId } });
      res
        .status(200)
        .json({ message: `Product id: ${productId} updated seccesfully` });
    } catch (err) {
      console.log(err);
      next(err);
      // if (err.name === "SequelizeValidationError") {
      //   res.status(400).json({ message: err.errors[0].message });
      // } else {
      //   res.status(500).json({ message: "Internal Server Error" });
      // }
    }
  }

  static async deleteProductsById(req, res, next) {
    const productId = req.params.id;
    try {
      const products = await Product.findByPk(productId);

      if (!products) {
        // res.status(404).json({ message: `Product ${productId} not found` });
        // return;
        throw { name: "NotFound", message: "Product not found" };
      }
      await Product.destroy({ where: { id: productId } });
      res
        .status(200)
        .json({ message: `Product id: ${productId} deleted seccesfully` });
    } catch (err) {
      next(err);
    }
  }
};
