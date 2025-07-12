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

describe("Endpoint list pada public site", () => {
  test("Berhasil mendapatkan entitas utama tanpa menggunakan query filter parameter", async () => {
    const response = await request(app).get("/pub/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("dataProduct");
    expect(Array.isArray(response.body.dataProduct)).toBe(true);

    expect(response.body.dataProduct.length).toBeGreaterThan(0); //* > 0
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

  test("Berhasil mendapatkan entitas utama serta panjang yang sesuai ketika memberikan page tertentu", async () => {
    const response = await request(app).get(
      "/pub/products?page[size]=2&page[number]=2"
    );

    expect(response.status).toBe(200);

    expect(response.body.dataProduct.length).toBeLessThanOrEqual(2);
    expect(response.body).toHaveProperty("page", 2);
    expect(response.body).toHaveProperty("dataProductPerPage", 2);
  });
});

describe("Endpoint detail pada public site", () => {
  test("Berhasil mendapatkan 1 entitas utama sesuai dengan params id yang diberikan", async () => {
    const productId = 10;
    const response = await request(app).get(`/pub/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", expect.any(Number));
  });

  test("Gagal mendapatkan entitas utama karena params id yang diberikan tidak ada di data base/invalid", async () => {
    const productId = 55;
    const response = await request(app).get(`/pub/products/${productId}`);

    // berekspektasi
    expect(response.status).toBe(404);

    expect(response.body).toHaveProperty("message", "Product not found");
  });
});
