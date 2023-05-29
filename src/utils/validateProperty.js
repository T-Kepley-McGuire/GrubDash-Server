
/*
  Middleware for testing if a property with name
  prop is valid property. Must exist and have 
  data in it (or else be a number or array).
  error message left as default if not provided
*/
function validateProperty(prop, errorMessage = null) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (
      data[prop] &&
      (data[prop].length > 0 || Number(data[prop]) || Array.isArray(data[prop]))
    ) {
      return next();
    }
    next({
      status: 400,
      message: errorMessage ? errorMessage : `Dish must include a ${prop}`,
    });
  };
}

module.exports = validateProperty;
