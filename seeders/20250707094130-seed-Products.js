"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = require("../data/products.json").map((product) => {
      delete product.id;
      product.createdAt = new Date();
      product.updatedAt = new Date();
      return product;
    });
    await queryInterface.bulkInsert("Products", products);
    await queryInterface.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('"Products"', 'id'), coalesce(max(id), 1)) FROM "Products";`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
