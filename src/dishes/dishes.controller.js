const path = require("path");

const dishes = require(path.resolve("src/data/dishes-data"));

const nextId = require("../utils/nextId");
const validateProperty = require("../utils/validateProperty");
const validateNumberProperty = require("../utils/validateNumberProperty");

/*
  Tests if dish exists and if it does saves 
  to result.locals for later use. If not throws
  404 error
*/
function dishExists(req, res, next) {
  const { dishId } = req.params;

  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    res.locals.dish = foundDish;
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${dishId}.` });
}

/*
    Use-case specific middleware to test if
    dishId in current dish is equal to id of
    given dish. Passes if no dish.id given
*/
function validateDishId(req, res, next) {
  const dishId = res.locals.dish.id;
  const {
    data: { id },
  } = req.body;

  if (!id || id === dishId) {
    return next();
  }
  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

/*
  GET /dishes 
  Sends all dishes as JSON list
*/
function list(req, res, next) {
  res.json({ data: dishes });
}

/*
  POST /dishes
  Creates a new dish with properties of given data
  Sends new dish back
*/
function create(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  const newDish = {
    name,
    description,
    price,
    image_url,
    id: nextId(),
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

/*
  GET /dishes/:dishId
  Sends dish of dishId
*/
function read(req, res, next) {
  res.json({ data: res.locals.dish });
}

/*
  PUT /dishes/:dishId
  Updates dish of dishId with properties of given data
  Sends updated dish back
*/
function update(req, res, next) {
  const { data: { name, description, price, image_url } = {} } = req.body;
  const dish = res.locals.dish;

  dish.name = name;
  dish.description = description;
  dish.price = price;
  dish.image_url = image_url;

  res.json({ data: dish });
}

module.exports = {
  list,

  // Validate dish exists
  read: [dishExists, read],

  // Validate properties of given dish
  create: [
    validateProperty("name"),
    validateProperty("description"),
    validateProperty("price"),
    validateNumberProperty("price"),
    validateProperty("image_url"),
    create,
  ],

  // Validate dish exists and properties of given dish
  update: [
    dishExists,
    validateDishId,
    validateProperty("name"),
    validateProperty("description"),
    validateProperty("price"),
    validateNumberProperty("price"),
    validateProperty("image_url"),
    update,
  ],
};
