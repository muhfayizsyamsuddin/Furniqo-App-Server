module.exports = function errorHandler(err, req, res, next) {
  console.log(err, "<== errhandler");

  if (err.name === "BadRequest") {
    res.status(400).json({ message: err.message });
  } else if (err.name === "Unauthorized") {
    res.status(401).json({ message: err.message });
  } else if (err.name === "SequelizeValidationError") {
    res.status(400).json({ message: err.errors[0].message });
  } else if (err.name === "Forbidden") {
    res.status(403).json({ message: err.message });
  } else if (err.name === "NotFound") {
    res.status(404).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
