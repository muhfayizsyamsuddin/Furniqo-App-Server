const { User } = require("../models/index");
const { verifyToken } = require("../helpers/jwt");

//! authentication = untuk identify user/verifikasi(dia itu siapa?)
// middleware
module.exports = async function authentication(req, res, next) {
  // console.log("helo", req.headers);
  //! Extract token: Get Bearer token from authorization header
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    next({ name: "Unauthorized", message: "Invalid token" });
    return;
  }
  const access_token = bearerToken.split(" ")[1];
  // console.log({ access_token }, "<====");

  try {
    //! Verify token
    const data = verifyToken(access_token);
    // console.log({ data }, "<<===-");

    const user = await User.findByPk(data.id);
    // console.log(user, "===");

    if (!user) {
      // res.status(401).json({ message: "Invalid token" });
      throw { name: "Unauthorized", message: "Invalid token" };
    }
    //! Attach user
    req.user = user;
    //! continue: call next() to proceed
    next();
  } catch (err) {
    next(err);
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};
