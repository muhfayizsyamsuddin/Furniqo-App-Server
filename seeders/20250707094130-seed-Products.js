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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
