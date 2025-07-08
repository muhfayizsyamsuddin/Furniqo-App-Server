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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// users
app.post("/add-user", UserController.createUsers);
app.post("/login", UserController.login);

app.use(authentication);

// {
//   'user-agent': 'PostmanRuntime/7.44.1',
//   accept: '*/*',
//   'postman-token': 'fcfaa05a-9f04-4c50-814b-1fdb8ac1c4e1',
//   host: 'localhost:3000',
//   'accept-encoding': 'gzip, deflate, br',
//   connection: 'keep-alive'
// }

app.post("/products", ProductController.createProducts);
app.get("/products", ProductController.getProducts);
app.get("/products/:id", ProductController.detailProductsById);
app.put("/products/:id", ProductController.updateProductsById);
app.delete("/products/:id", ProductController.deleteProductsById);

app.post("/categories", CategoryController.postCategories);
app.get("/categories", CategoryController.getCategories);
app.put("/categories/:id", CategoryController.updateCategoriesById);

app.get("/pub/products", PublicController.publicGetProducts);
app.get("/pub/products/:id", PublicController.pubDetailProductsById);

app.listen(port, () => {
  console.log(`Server can be access in http://localhost:${port}`);
});
