module.exports = function guardAdmin(req, res, next) {
  console.log(req.user.role, "<=== guard admin");
  if (req.user.role === "admin") {
    next();
  } else if (req.user.role === "staff" && req.user.id === product.authorId) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden Access" });
  }
};
