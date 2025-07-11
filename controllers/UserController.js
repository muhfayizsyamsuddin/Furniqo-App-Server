const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models/index");

module.exports = class UserController {
  static async createUsers(req, res, next) {
    const { username, email, password, phoneNumber, address } = req.body;
    try {
      // console.log(req.body);

      const user = await User.create(req.body);
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      });
    } catch (err) {
      // console.log("error:", err);
      next(err);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email) {
        // res.status(400).json({ message: "Email is required" });
        throw { name: "BadRequest", message: "Email is required" };
      }
      if (!password) {
        // res.status(400).json({ message: "Password is required" });
        throw { name: "BadRequest", message: "Password is required" };
      }
      const user = await User.findOne({ where: { email } });
      console.log(user);
      if (!user) {
        // res.status(401).json({ message: "Invalid email or password" });
        throw {
          name: "Unauthorized",
          message: "Email or password is required",
        };
        // return;
      }
      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        // res.status(401).json({ message: "Invalid email or password" });
        // return;
        throw { name: "Unauthorized", message: "Password is required" };
      }
      const accessToken = signToken({ id: user.id });
      res
        .status(200)
        .json({ message: "Login Success", access_token: accessToken });
    } catch (err) {
      // console.log(err, "<<<");
      next(err);
    }
  }
};
