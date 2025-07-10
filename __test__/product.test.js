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
const { truncates } = require("bcryptjs");
const { queryInterface } = sequelize;

//* Protected endpoint testing
let access_token_admin;

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
});

afterAll(async () => {
  //! clean up data
  console.log("afterAll => clean up");

  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncates: true,
  });

  await queryInterface.bulkDelete("Categories", null, {
    restartIdentity: true,
    truncates: true,
  });

  await queryInterface.bulkDelete("Products", null, {
    restartIdentity: true,
    truncates: true,
  });
});

describe.only("Create, perlu melakukan pengecekan pada status dan response", () => {
  test.only("Berhasil membuat entitas utama", async () => {
    const productCreate = {
      name: "lamp",
      description: "minimalist",
      price: 40000,
      stock: 10,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
      categoryId: 2,
      authorId: 2,
    };
    const response = await request(app)
      .post("/products")
      .send(productCreate)
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", productCreate.name);
    expect(response.body).toHaveProperty(
      "description",
      productCreate.description
    );
    expect(response.body).toHaveProperty("price", productCreate.price);
    expect(response.body).toHaveProperty("stock", productCreate.stock);
    expect(response.body).toHaveProperty("imageUrl", productCreate.imageUrl);
    expect(response.body).toHaveProperty(
      "categoryId",
      productCreate.categoryId
    );
    expect(response.body).toHaveProperty("authorId", productCreate.authorId);
  });
});
