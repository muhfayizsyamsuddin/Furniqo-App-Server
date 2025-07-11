const { Product, Category } = require("../models/index");
const { Op } = require("sequelize");

module.exports = class PublicController {
  static async publicGetProducts(req, res, next) {
    try {
      const {
        search,
        filter,
        sort,
        "page[size]": size,
        "page[number]": number,
      } = req.query;
      // console.log(req.query);
      const paramsQuerySQL = {
        where: {},
      };
      //! search
      if (search) {
        paramsQuerySQL.where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      //! filter
      if (filter) {
        paramsQuerySQL.where.categoryId = filter;
      }
      //! sort
      if (sort) {
        const ordering = sort[0] === "-" ? "DESC" : "ASC";
        const columnName = ordering === "DESC" ? sort.slice(1) : sort;
        paramsQuerySQL.order = [[columnName, ordering]];
      }
      //! pagination
      let limit = 10;
      let pageNumber = 1;
      // if (page) {
      if (size) {
        limit = +size;
        paramsQuerySQL.limit = limit;
      }
      if (number) {
        pageNumber = +number;
        paramsQuerySQL.offset = limit * (pageNumber - 1);
      }
      // }

      const { count, rows } = await Product.findAndCountAll(paramsQuerySQL);
      res.status(200).json({
        page: pageNumber,
        data: rows,
        totalData: count,
        totalPage: Math.ceil(count / limit),
        dataPerPage: limit,
      });
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

  static async pubDetailCategoriesById(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
};
