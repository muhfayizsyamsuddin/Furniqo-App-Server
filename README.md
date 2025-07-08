[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19902182&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# My First Server App

## Endpoints

List of available endpoints:

- `POST /register`
- `POST /login`

Routes below need authentication:

- `GET /products`
- `POST /products`

Routes below need authorization:

> The request user should be an admin

- `DELETE /products/:id`
- `PUT /products/:id`
- `PATCH /products/:id/show-status`

&nbsp;

## 1. POST /register

Description:

- Register a new user into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "number",
  "email": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 2. POST /login

Description:

- Login into the system

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Invalid email or password"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```

&nbsp;

## 3. POST /products

Description:

- Create a new product

Request:

- headers:

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "imageUrl": "string",
  "categoryId": "number",
  "authorId": "number"
}
```

_Response (201 - Created)_

```json
[
  {
    "id": 28,
    "name": "chair",
    "description": "minimalist",
    "price": 100000,
    "stock": 10,
    "imageUrl": "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/888/1388807_PE964980_S5.webp",
    "categoryId": 2,
    "authorId": 1
  }
]
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 4. GET /products

Description:

- Get all product from the database and include users without password field

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "imageUrl": "string",
    "categoryId": "number",
    "authorId": "number",
    "User": {
      "id": 2,
      "username": "string",
      "email": "string",
      "role": "string",
      "phoneNumber": "string",
      "address": "string"
    }
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 5. GET /products/:id

Description:

- Get details product from the database by id

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Error not found"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 20,
    "name": "Corner Bookshelf",
    "description": "Space-saving corner bookshelf with 4 tiers for small rooms.",
    "price": 210000,
    "stock": 11,
    "imageUrl": "https://example.com/images/corner-bookshelf.jpg",
    "categoryId": 1,
    "authorId": 3
  }
]
```

&nbsp;

## 6. PUT /products/:id

Description:

- Update product by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "imageUrl": "string",
  "categoryId": "number",
  "authorId": "number"
}
```

_Response (200 - OK)_

```json
{
  "id": 22,
  "name": "bed",
  "description": "solid",
  "price": 30000,
  "stock": 11,
  "imageUrl": "https://20/1022010_PE832396_S5.webp",
  "categoryId": 1,
  "authorId": 2
}
```

_Response (404 - Not Found)_

```json
{
  "message": "product id 22 not found"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 7. DELETE /products/:id

Description:

- Delete product by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
{
  "message": "Product id 21 deleted seccesfully"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Movie id 21 not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 8. POST /categories

Description:

- Create a new category

Request:

- headers:

- body:

```json
{
  "name": "string"
}
```

_Response (201 - Created)_

```json
[
  {
    "id": 4,
    "name": "room"
  }
]
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 9. GET /categories

Description:

- Get all category from the database

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "number",
    "name": "string"
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 10. PUT /categories/:id

Description:

- Update category by id

Request:

- params:

```json
{
  "id": "number (required)"
}
```

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (200 - OK)_

```json
{
  "id": 4,
  "name": "home room"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "category id 4 not found"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Validation error message"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized to access this resource"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 11. GET /pub/products

Description:

- Get all products for public site from the database

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - OK)_

```json
[
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "stock": "number",
    "imageUrl": "string",
    "categoryId": "number",
    "authorId": "number"
  }
]
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## 12. GET /pub/products/:id

Description:

- Get details product for public site from the database by id

Request:

- headers:

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- params:

```json
{
  "id": "number (required)"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Error not found"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 20,
    "name": "Corner Bookshelf",
    "description": "Space-saving corner bookshelf with 4 tiers for small rooms.",
    "price": 210000,
    "stock": 11,
    "imageUrl": "https://example.com/images/corner-bookshelf.jpg",
    "categoryId": 1,
    "authorId": 3
  }
]
```

&nbsp;
