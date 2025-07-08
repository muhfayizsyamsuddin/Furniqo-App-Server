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
app.get("/products/:id", ProductController.detailProductsById);
app.put("/products/:id", ProductController.updateProductsById);
app.delete("/products/:id", ProductController.deleteProductsById);

app.post("/categories", CategoryController.postCategories);
app.get("/categories", CategoryController.getCategories);
app.put("/categories/:id", CategoryController.updateCategoriesById);

app.get("/pub/products", ProductController.publicGetProducts);
app.get("/pub/products/:id", ProductController.pubDetailProductsById);

app.post("/add-user", UserController.createUsers);

app.listen(port, () => {
  console.log(`Server can be access in http://localhost:${port}`);
});
