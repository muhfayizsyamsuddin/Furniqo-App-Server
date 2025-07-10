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

describe("Create, perlu melakukan pengecekan pada status dan response", () => {
  test("Berhasil membuat entitas utama", async () => {
    const productCreate = {
      name: "lamp",
      description: "minimalist",
      price: 40000,
      stock: 10,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
      categoryId: 1,
      authorId: 1,
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

  test("Gagal menjalankan fitur karena belum login", async () => {
    const productCreate = {
      name: "lamp",
      description: "minimalist",
      price: 40000,
      stock: 10,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
      categoryId: 1,
      authorId: 1,
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app).post("/products").send(productCreate);

    // berekspektasi
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const productCreate = {
      name: "lamp",
      description: "minimalist",
      price: 40000,
      stock: 10,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
      categoryId: 1,
      authorId: 1,
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app)
      .post("/products")
      .send(productCreate)
      .set("Authorization", `Bearer ${access_token_admin}+invalid`);

    // berekspektasi
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal ketika request body tidak sesuai (validation required)", async () => {
    const productCreate = {
      description: "minimalist",
      price: 40000,
      stock: 10,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
      categoryId: 1,
      authorId: 1,
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app)
      .post("/products")
      .send(productCreate)
      .set("Authorization", `Bearer ${access_token_admin}`);

    // status
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("Update PUT, perlu melakukan pengecekan pada status dan response", () => {
  test("Berhasil mengupdate data entitas Utama berdasarkan params id yang diberikan", async () => {
    const productUpdate = {
      name: "Curtain",
      description: "smooth and soft",
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    const productId = 2;
    const response = await request(app)
      .put(`/products/${productId}`)
      .send(productUpdate)
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `Product id: ${productId} updated seccesfully`
    );
    // expect(response.body).toHaveProperty("id", productId);
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const productUpdate = {
      name: "Curtain",
      description: "smooth and soft",
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app)
      .post("/products/:id")
      .send(productUpdate);

    // berekspektasi
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const productUpdate = {
      name: "Curtain",
      description: "smooth and soft",
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app)
      .post("/products/:id")
      .send(productUpdate)
      .set("Authorization", `Bearer ${access_token_admin}+invalid`);

    // berekspektasi
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const productUpdate = {
      name: "Curtain",
      description: "smooth and soft",
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    // .post -> method nya
    // .send -> attach body
    const productId = 99;
    const response = await request(app)
      .put(`/products/${productId}`)
      .send(productUpdate)
      .set("Authorization", `Bearer ${access_token_admin}`);

    // berekspektasi
    expect(response.status).toBe(404);

    expect(response.body).toHaveProperty("message", "Product not found");
  });

  test("Gagal menjalankan fitur ketika Staff mengolah data entity yang bukan miliknya", async () => {
    const productUpdate = {
      name: "Curtain",
      description: "smooth and soft",
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    // .post -> method nya
    // .send -> attach body
    const productId = 1;
    const response = await request(app)
      .put(`/products/${productId}`)
      .send(productUpdate)
      .set("Authorization", `Bearer ${access_token_staff}`);

    // berekspektasi
    expect(response.status).toBe(403);

    expect(response.body).toHaveProperty("message", "Forbidden Access");
  });
  //! Belum
  test("Gagal ketika request body yang diberikan tidak sesuai", async () => {
    const productUpdate = {
      price: 170000,
      stock: 17,
      imageUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
      categoryId: 1,
      authorId: 2,
    };
    // .post -> method nya
    // .send -> attach body
    const productId = 1;
    const response = await request(app)
      .put(`/products/${productId}`)
      .send(productUpdate)
      .set("Authorization", `Bearer ${access_token_admin}`);

    // status
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });
});

describe("Delete, perlu melakukan pengecekan pada status dan response", () => {
  test("Berhasil menghapus data entitas Utama berdasarkan params id yang diberikan", async () => {
    // const productDelete = {
    //   name: "Curtain",
    //   description: "smooth and soft",
    //   price: 170000,
    //   stock: 17,
    //   imageUrl:
    //     "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
    //   categoryId: 1,
    //   authorId: 2,
    // };
    const productId = 2;
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${access_token_admin}`);
    //   .send(productDelete);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      `Product id: ${productId} deleted seccesfully`
    );
    // expect(response.body).toHaveProperty("id", productId);
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    // const productDelete = {
    //   name: "Curtain",
    //   description: "smooth and soft",
    //   price: 170000,
    //   stock: 17,
    //   imageUrl:
    //     "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
    //   categoryId: 1,
    //   authorId: 2,
    // };
    const productId = 2;
    const response = await request(app).delete(`/products/${productId}`);
    //   .send(productDelete);
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const productId = 2;
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${access_token_admin}+invalid`);
    //   .send(productDelete)

    // berekspektasi
    expect(response.status).toBe(401);

    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const productId = 99;
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${access_token_admin}`);

    // berekspektasi
    expect(response.status).toBe(404);

    expect(response.body).toHaveProperty("message", "Product not found");
  });

  //   test("Gagal menjalankan fitur ketika Staff menghapus entity yang bukan miliknya", async () => {
  //     const productDelete = {
  //       name: "Curtain",
  //       description: "smooth and soft",
  //       price: 170000,
  //       stock: 17,
  //       imageUrl:
  //         "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/174/0817490_PE774044_S5.webp",
  //       categoryId: 1,
  //       authorId: 2,
  //     };
  //     // .post -> method nya
  //     // .send -> attach body
  //     const productId = 1;
  //     const response = await request(app)
  //       .delete(`/products/${productId}`)
  //       .send(productDelete)
  //       .set("Authorization", `Bearer ${access_token_staff}`);

  //     // berekspektasi
  //     expect(response.status).toBe(403);

  //     expect(response.body).toHaveProperty("message", "Forbidden Access");
  //   });
});
