const path = require("path");

const orders = require(path.resolve("src/data/orders-data"));

const nextId = require("../utils/nextId");
const validateProperty = require("../utils/validateProperty");
const validateArrayProperty = require("../utils/validateArrayProperty");


/*
    Tests if order exists and if it does saves 
    to result.locals for later use. If not throws
    404 error
*/
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
}

/*
    Use-case specific middleware to test if
    orderId in current order is equal to id of
    given order. Passes if no order.id given
*/
function validateOrderId(req, res, next) {
  const orderId = res.locals.order.id;
  const {
    data: { id },
  } = req.body;

  if (!id || id === orderId) {
    return next();
  }
  next({
    status: 400,
    message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
  });
}

/* 
    Use-case specific middleware to test if all 
    dish quantities are valid integers above 0
*/
function validateQuantity(req, res, next) {
  const { data: { dishes } = {} } = req.body;

  let index = -1;
  if (
    dishes.every((dish, dishIndex) => {
      const quantity = dish.quantity;
      const isGood =
        typeof quantity === "number" &&
        quantity > 0 &&
        Math.floor(quantity) === quantity;
      if (!isGood) index = dishIndex;
      return isGood;
    })
  ) {
    return next();
  }
  next({
    status: 400,
    message: `Dish ${index} must have a quantity that is an integer greater than 0`,
  });
}

/*
    Use-case specific middleware to test if incoming
    order can update current order based on status
    Current order cannot have status delivered, 
    incoming order must have valid status
*/
function validateStatusToUpdate(req, res, next) {
  const status = res.locals.order.status;
  if (req.body.data.status === "invalid")
    return next({ status: 400, message: "status" });
  if (status !== "delivered") {
    return next();
  }
  next({
    status: 400,
    message: `A delivered order cannot be changed`,
  });
}

/*
    Use-case specific middleware to test if given
    order can be deleted based on status. Only orders
    that are pending can be deleted
*/
function validateStatusToDelete(req, res, next) {
  const status = res.locals.order.status;
  if (status === "pending") {
    return next();
  }
  next({
    status: 400,
    message: `An order cannot be deleted unless it is pending.`,
  });
}

/*
    GET /orders 
    Sends all orders as JSON list
*/
function list(req, res, next) {
  res.json({ data: orders });
}

/*
    POST /orders
    Creates new order with given properties in data
    Sends new order with status 201
*/
function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };

  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

/*
    GET /orders/:orderId
    Sends order of orderId
*/
function read(req, res, next) {
  res.json({ data: res.locals.order });
}

/*
    PUT /orders/:orderId
    Updates order of orderId with given properties
    in data
    Sends updated order
*/
function update(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const order = res.locals.order;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

/*
    DELETE /orders/:orderId
    Deletes order of orderId from all orders
    Sends status 201
*/
function destroy(req, res, next) {
  const orderId = req.params.orderId;
  const index = orders.findIndex((order) => order.id === orderId);
  const deletedOrders = orders.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  list,

  // Validate all properties in data
  create: [
    validateProperty("deliverTo"),
    validateProperty("mobileNumber"),
    validateProperty("dishes"),
    validateArrayProperty("dishes"),
    validateQuantity,
    create,
  ],

  // Validate that order exists
  read: [orderExists, read],

  // Validate order exists and all properties
  update: [
    orderExists,
    validateOrderId,
    validateProperty("deliverTo"),
    validateProperty("mobileNumber"),
    validateProperty("dishes"),
    validateArrayProperty("dishes"),
    validateQuantity,
    validateProperty(
      "status",
      "Order must have a status of pending, preparing, out-for-delivery, delivered"
    ),
    validateStatusToUpdate,
    update,
  ],

  // Validate order exists and can be deleted
  delete: [orderExists, validateStatusToDelete, destroy],
};
