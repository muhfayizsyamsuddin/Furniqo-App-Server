const { Category } = require("../models/index");

module.exports = class CategoryController {
  static async postCategories(req, res) {
    try {
      console.log(req.body);

      const createdCategory = await Category.create(req.body);
      res.status(201).json(createdCategory);
    } catch (err) {
      console.log(err, "---->");
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      console.log("error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateCategoriesById(req, res) {
    const categoryId = req.params.id;
    try {
      const category = await Category.findByPk(categoryId);
      console.log(category, "<---");

      if (!category) {
        res.status(404).json({ message: `category ${categoryId} not found` });
        return;
      }
      await category.update(req.body);
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
};
