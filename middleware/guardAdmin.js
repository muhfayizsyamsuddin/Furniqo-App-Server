module.exports = function guardAdmin(req, res, next) {
  // console.log(req.user.role, "<=== guard admin");
  if (req.user.role === "admin") {
    next();
  } else {
    next({ name: "Forbidden", message: "Forbidden Access" });
    return;
  }
};
