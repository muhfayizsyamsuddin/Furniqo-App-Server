// const request = require("supertest");
// const { test, expect } = require("@jest/globals");
// const app = require("../app");
// const { signToken } = require("../helpers/jwt");

// //* Protected endpoint testing
// let access_token_admin;

// //* Protected endpoint testing setup token
// //  const admin = await User.findOne({ where: { role: "Admin" } });
// //  access_token_admin = signToken({ id: admin.id });

// test("Berhasil membuat entitas utama", async () => {
//   const productCreate = {
//     name: "lamp",
//     description: "minimalist",
//     price: 40000,
//     stock: 10,
//     imageUrl:
//       "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
//     categoryId: 2,
//     authorId: 3,
//   };
//   // .post -> method nya
//   // .send -> attach body
//   const response = await request(app)
//     .post("/products")
//     .send(productCreate)
//     .set("Authorization", `Bearer ${access_token_admin}`);
//   //   console.log(response, "<== ro");
//   //   console.log(response.status, response.body, "<== rsrb");

//   expect(response.status).toBe(201);

//   //   const isResponseArray = Array.isArray(response.body);
//   //   console.log(isResponseArray, "isresArr");

//   //   expect(isResponseArray).toBeTruthy();
//   expect(response.body).toHaveProperty("id", expect.any(Number));
//   expect(product.body).toHaveProperty("name", productCreate.name);
//   expect(product.body).toHaveProperty("description", productCreate.description);
//   expect(product.body).toHaveProperty("description", productCreate.price);
//   expect(product.body).toHaveProperty("description", productCreate.stock);
//   expect(product.body).toHaveProperty("description", productCreate.imageUrl);
//   expect(product.body).toHaveProperty("description", productCreate.categoryId);
//   expect(product.body).toHaveProperty("description", productCreate.authorId);
// });
