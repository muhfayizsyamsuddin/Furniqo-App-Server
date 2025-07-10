// const request = require("supertest");
// const {
//   test,
//   expect,
//   describe,
//   beforeAll,
//   afterAll,
// } = require("@jest/globals");
// const app = require("../app");
// const { signToken } = require("../helpers/jwt");
// const { hashPassword } = require("../helpers/bcrypt");
// const { sequelize, User, Category } = require("../models");
// const { truncates } = require("bcryptjs");
// const { queryInterface } = sequelize;

// //* Protected endpoint testing
// // let access_token_admin;

// beforeAll(async () => {
//   //! Seeding
//   console.log("beforeAll => seeding");

//   const categories = require("../data/categories.json").map((category) => {
//     delete category.id;
//     category.createdAt = new Date();
//     category.updatedAt = new Date();
//     return category;
//   });

//   await queryInterface.bulkInsert("Categories", categories);

//   //* Protected endpoint testing setup token
//   //   const admin = await User.findOne({ where: { role: "admin" } });
//   //   access_token_admin = signToken({ id: admin.id });
// });

// afterAll(async () => {
//   //! clean up data
//   console.log("afterAll => clean up");

//   await queryInterface.bulkDelete("Categories", null, {
//     restartIdentity: true,
//     truncate: true,
//     cascade: true,
//   });
// });

// describe.only("Create, perlu melakukan pengecekan pada status dan response", () => {
//   test.only("Berhasil membuat entitas utama", async () => {
//     const categoryCreate = {
//       name: "halaman",
//     };
//     const response = await request(app).post("/category").send(categoryCreate);

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id", expect.any(Number));
//     expect(response.body).toHaveProperty("name", categoryCreate.name);
//   });
// });
