const request = require("supertest");
const {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const app = require("../app");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const { sequelize, User } = require("../models");
const { queryInterface } = sequelize;

//* Protected endpoint testing
let access_token_admin;
let access_token_staff;

beforeAll(async () => {
  //! Seeding
  console.log("beforeAll => seeding");

  const users = require("../data/users.json").map((user) => {
    delete user.id;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.password = hashPassword(user.password);
    return user;
  });

  const categories = require("../data/categories.json").map((category) => {
    delete category.id;
    category.createdAt = new Date();
    category.updatedAt = new Date();
    return category;
  });

  const products = require("../data/products.json").map((product) => {
    delete product.id;
    product.createdAt = new Date();
    product.updatedAt = new Date();
    return product;
  });
  await queryInterface.bulkInsert("Users", users);
  await queryInterface.bulkInsert("Categories", categories);
  await queryInterface.bulkInsert("Products", products);

  //* Protected endpoint testing setup token
  const admin = await User.findOne({ where: { role: "admin" } });
  access_token_admin = signToken({ id: admin.id });
  const staff = await User.findOne({ where: { role: "Staff" } });
  access_token_staff = signToken({ id: staff.id });
});

afterAll(async () => {
  //! clean up data
  console.log("afterAll => clean up");

  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  });

  await queryInterface.bulkDelete("Categories", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  });

  await queryInterface.bulkDelete("Products", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  });
});

describe("Public site, perlu melakukan pengecekan pada status dan response", () => {
  test("Berhasil mendapatkan entitas utama tanpa menggunakan query filter parameter", async () => {
    const response = await request(app).get("/pub/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("dataProduct");
    expect(Array.isArray(response.body.dataProduct)).toBe(true);

    expect(response.body.dataProduct.length).toBeGreaterThan(0);
    const product = response.body.dataProduct[0]; //* data 1

    expect(product).toHaveProperty("name", expect.any(String));
    expect(product).toHaveProperty("description", expect.any(String));
    expect(product).toHaveProperty("price", expect.any(Number));
    expect(product).toHaveProperty("stock", expect.any(Number));
    expect(product).toHaveProperty("imageUrl", expect.any(String));
    expect(product).toHaveProperty("categoryId", expect.any(Number));
    expect(product).toHaveProperty("authorId", expect.any(Number));
  });

  test("Berhasil mendapatkan entitas utama dengan 1 query filter parameter", async () => {
    const response = await request(app).get("/pub/products?filter=1");

    // berekspektasi
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.dataProduct)).toBe(true);
    let productCreated = response.body.dataProduct;
    for (let i = 0; i < productCreated.length; i++) {
      expect(productCreated[i].categoryId).toBe(1);
    }
  });

  //   test("Berhasil mendapatkan entitas utama serta panjang yang sesuai ketika memberikan page tertentu", async () => {
  //     const productCreate = {
  //       name: "lamp",
  //       description: "minimalist",
  //       price: 40000,
  //       stock: 10,
  //       imageUrl:
  //         "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
  //       categoryId: 1,
  //       authorId: 1,
  //     };
  //     // .post -> method nya
  //     // .send -> attach body
  //     const response = await request(app)
  //       .post("/products")
  //       .send(productCreate)
  //       .set("Authorization", `Bearer ${access_token_admin}+invalid`);

  //     // berekspektasi
  //     expect(response.status).toBe(401);

  //     expect(response.body).toHaveProperty("message", "Invalid token");
  //   });
});

// describe("Endpoint detail pada public site, perlu melakukan pengecekan pada status dan response", () => {
//   test("Berhasil mendapatkan 1 entitas utama sesuai dengan params id yang diberikan", async () => {
//     const productCreate = {
//       name: "lamp",
//       description: "minimalist",
//       price: 40000,
//       stock: 10,
//       imageUrl:
//         "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
//       categoryId: 1,
//       authorId: 1,
//     };
//     const response = await request(app)
//       .post("/products")
//       .send(productCreate)
//       .set("Authorization", `Bearer ${access_token_admin}`);

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id", expect.any(Number));
//     expect(response.body).toHaveProperty("name", productCreate.name);
//     expect(response.body).toHaveProperty(
//       "description",
//       productCreate.description
//     );
//     expect(response.body).toHaveProperty("price", productCreate.price);
//     expect(response.body).toHaveProperty("stock", productCreate.stock);
//     expect(response.body).toHaveProperty("imageUrl", productCreate.imageUrl);
//     expect(response.body).toHaveProperty(
//       "categoryId",
//       productCreate.categoryId
//     );
//     expect(response.body).toHaveProperty("authorId", productCreate.authorId);
//   });

//   test("Gagal mendapatkan entitas utama karena params id yang diberikan tidak ada di data base/invalid", async () => {
//     const productCreate = {
//       name: "lamp",
//       description: "minimalist",
//       price: 40000,
//       stock: 10,
//       imageUrl:
//         "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
//       categoryId: 1,
//       authorId: 1,
//     };
//     // .post -> method nya
//     // .send -> attach body
//     const response = await request(app).post("/products").send(productCreate);

//     // berekspektasi
//     expect(response.status).toBe(401);

//     expect(response.body).toHaveProperty("message", "Invalid token");
//   });
// });
