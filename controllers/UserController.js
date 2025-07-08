const { User } = require("../models/index");

module.exports = class UserController {
  static async createUsers(req, res) {
    try {
      const user = await User.create();
      res.status(201).json(user);
    } catch (err) {
      console.log("error:", err);
      if (err.name === "SequelizeValidationError") {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }
};
