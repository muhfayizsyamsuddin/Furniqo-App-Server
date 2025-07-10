require("dotenv").config();
// console.log(process.env);

const express = require("express");
const app = express();
const port = 3000;

const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const CategoryController = require("./controllers/CategoryController");
const PublicController = require("./controllers/PublicController");
const { verifyToken } = require("./helpers/jwt");
const { User } = require("./models/index");
const authentication = require("./middleware/authentication");
const guardAdmin = require("./middleware/guardAdmin");
const errorHandler = require("./middleware/errorHandler");
const guardAuthor = require("./middleware/guardAuthor");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// users
app.post("/login", UserController.login);
// authen
app.use(authentication);

// {
//   'user-agent': 'PostmanRuntime/7.44.1',
//   accept: '*/*',
//   'postman-token': 'fcfaa05a-9f04-4c50-814b-1fdb8ac1c4e1',
//   host: 'localhost:3000',
//   'accept-encoding': 'gzip, deflate, br',
//   connection: 'keep-alive'
// }
// app.use(guardAdmin);
app.post("/products", ProductController.createProducts);
app.get("/products", ProductController.getProducts);
app.get("/products/:id", ProductController.detailProductsById);
app.put("/products/:id", guardAuthor, ProductController.updateProductsById);
app.delete("/products/:id", guardAuthor, ProductController.deleteProductsById);

app.post("/categories", CategoryController.postCategories);
app.get("/categories", CategoryController.getCategories);
app.put("/categories/:id", CategoryController.updateCategoriesById);

app.get("/pub/products", PublicController.publicGetProducts);
app.get("/pub/products/:id", PublicController.pubDetailProductsById);
//! multer
//* 1. import dan config
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.patch(
  "/products/:id/cover-url",
  guardAuthor,
  upload.single("imageUrl"),
  ProductController.updateProductCoverUrlById
);

//* only admin
app.post("/add-user", guardAdmin, UserController.createUsers);
//* error handler
app.use(errorHandler);

module.exports = app;

//* sequelize db:create --env test
//* sequelize db:migrate --env test
//* sequelize db:seed:all --env test
