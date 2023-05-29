
/*
  Middleware for testing if input property
  with name prop is a valid array meaning
  it must be an array with non-zero elements
*/
function validateArrayProperty(prop) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const arr = data[prop];
    if (Array.isArray(arr) && arr.length > 0) {
      return next();
    }
    next({
      status: 400,
      message: `Order must include at least one dish`,
    });
  };
}

module.exports = validateArrayProperty;
