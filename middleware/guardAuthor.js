const { Product } = require("../models/index");

module.exports = async function guardAuthor(req, res, next) {
  // console.log(req.user.role, "<=== guard author");

  const productId = req.params.id;
  // console.log(productId, "===");
  // console.log(req.params.id, "~~~~!!!");
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw { name: "NotFound", message: "Product not found" };
    }
    if (req.user.role === "admin") {
      next();
    } else if (
      (req.user.role === "Staff" || req.user.role === "staff") &&
      req.user.id === product.authorId
    ) {
      next();
    } else {
      throw { name: "Forbidden", message: "Forbidden Access" };
    }
  } catch (err) {
    next(err);
  }
};
