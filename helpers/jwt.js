const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const signToken = (payload) => {
  console.log({ SECRET_KEY });
  return jwt.sign(payload, SECRET_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

// const token = signToken({ id: 89 });
// // verify a token symmetric - synchronous
// const decoded = verifyToken(token);
// // console.log(token);

// console.log(decoded);

module.exports = {
  signToken,
  verifyToken,
};
