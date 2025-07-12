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
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

//* Protected endpoint testing
let access_token_admin;

//* Protected endpoint testing setup token
//  const admin = await User.findOne({ where: { role: "Admin" } });
//  access_token_admin = signToken({ id: admin.id });

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
  await queryInterface.bulkInsert("Users", users);
});

afterAll(async () => {
  //! clean up data
  console.log("afterAll => clean up");
  await queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  });
});

describe("Login (Admin)", () => {
  test("Berhasil login dan mengirimkan access_token", async () => {
    const userLogin = {
      email: "abdul@gmail.com",
      password: "abdul123",
    };
    // .post -> method nya
    // .send -> attach body
    const response = await request(app).post("/login").send(userLogin);
    //   .set("Authorization", `Bearer ${access_token_admin}`);
    //   console.log(response, "<== ro");
    //   console.log(response.status, response.body, "<== rsrb");
    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("message", "Login Success");
  });

  test("Email tidak diberikan / tidak diinput", async () => {
    const userLogin = {
      password: "abdul123",
    };
    const response = await request(app).post("/login").send(userLogin);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Password tidak diberikan / tidak diinput", async () => {
    const userLogin = {
      email: "abdul@gmail.com",
    };
    const response = await request(app).post("/login").send(userLogin);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Email diberikan invalid / tidak tidak terdaftar", async () => {
    const userLogin = {
      email: "invalid@gmail.com",
      password: "abdul123",
    };
    const response = await request(app).post("/login").send(userLogin);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or password is required"
    );
  });

  test("Password diberikan salah / tidak tidak match", async () => {
    const userLogin = {
      email: "abdul@gmail.com",
      password: "passwordSalah",
    };
    const response = await request(app).post("/login").send(userLogin);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
});
