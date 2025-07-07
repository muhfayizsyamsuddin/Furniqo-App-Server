const express = require("express");
const app = express();
const port = 3000;

const UserController = require("./controllers/UserController");
const ProductController = require("./controllers/ProductController");
const CategoryController = require("./controllers/CategoryController");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/products", ProductController.createProducts);
app.get("/products", ProductController.getProducts);

app.listen(port, () => {
  console.log(`Server can be access in http://localhost:${port}`);
});
