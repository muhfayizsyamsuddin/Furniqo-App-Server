const { Category } = require("../models/index");

module.exports = class CategoryController {
  static async postCategories(req, res, next) {
    try {
      // console.log(req.body);

      const createdCategory = await Category.create(req.body);
      res.status(201).json(createdCategory);
    } catch (err) {
      next(err);
    }
  }

  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async updateCategoriesById(req, res, next) {
    const categoryId = req.params.id;
    try {
      const category = await Category.findByPk(categoryId);
      // console.log(category, "<---");

      if (!category) {
        // res.status(404).json({ message: `category ${categoryId} not found` });
        // return;
        throw { name: "NotFound", message: "Category not found" };
      }
      await category.update(req.body);
      //   await Product.update({ where: { id: productId } });
      res
        .status(200)
        .json({ message: `Category id: ${categoryId} updated seccesfully` });
    } catch (err) {
      next(err);
    }
  }
};
