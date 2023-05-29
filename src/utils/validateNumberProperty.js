
/*
  Middleware for validating a given property of
  name prop is a number, integer, and above 0
  Errors when any of these fails
*/
function validateNumberProperty(prop) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const num = data[prop];
    if (typeof num === "number" && num > 0 && num === Math.floor(num)) {
      return next();
    }
    next({
      status: 400,
      message: `Dish must have a price that is an integer greater than 0`,
    });
  };
}

module.exports = validateNumberProperty;
