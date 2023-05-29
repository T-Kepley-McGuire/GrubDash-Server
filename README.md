# GrubDash-Server

### A Thinkful Assignment

This application is a server for saving, reading, and updating a set of orders and available dishes for a restaurant.

The server allows for the creation of new dishes and orders, the tracking of order status, and management of open orders.

## Usage

#### Dishes

Dishes have the following shape:

```
{
  "id": "3c637d011d844ebab1205fef8a7e36ea",
  "name": "A Dish",
  "description": "Generic dish with flavor",
  "price": 20,
  "image_url": "https://sample-pictures.com/example"
}
```

To create a new dish, submit POST request with all fields except "id"

To update a dish, submit a PUT request with all fields filled with desired data (id is not neccessary but if given must match the id of the request url)

### Orders

Orders have the following shape:

```
{
  "id": "f6069a542257054114138301947672ba",
  "deliverTo": "1111 Address Ave, City State Zipcode",
  "mobileNumber": "(555) 555-5555",
  "status": "out-for-delivery",
  "dishes": [
    {
      "id": "90c3d873684bf381dfab29034b5bba73",
      "name": "Falafel and tahini bagel",
      "description": "A warm bagel filled with falafel and tahini",
      "image_url": "https://images.pexels.com/photos/4560606/pexels-photo-4560606.jpeg?h=530&w=350",
      "price": 6,
      "quantity": 1
    }
  ]
}
```

To create a new order, submit a POST request with all fields except "id"

To update an order, submit a PUT request with all fields filled with desired data 
(id is not neccessary but if given must match the id of the request url) 
(dishes must contain at least one dish) 
(status may only be ```"pending" "preparing" "out-for-delivery" "deliverd"```)
(May only update an order that is pending)

To delete an order, submit a DELETE request to url with order ID
(May only delete delivered orders)

### Available Commands

| HTTP verb	| Path	| Description |
|---|---|---|
| GET	| /dishes |	Retrieve a list of all dishes
| POST | /dishes |	Create a new dish
| GET	| /dishes/:dishId |	Retrieve a dish by ID
| PUT	| /dishes/:dishId |	Update a dish by ID
| GET |	/orders |	Retrieve a list of all orders
| GET	| /orders/:orderId |	Retrieve an order by ID
| DELETE |	/orders/:orderId |	Delete an order by ID

---

## Implementation

This server is created from a Thinkful template using Express and Express Routing

Middleware handles error checking for incoming data

Data is not saved to any database or external memory. All data is saved in memory and changes are reverted when the server restarts

## Installation

1. Fork and Clone repository
2. Open terminal to local repo
3. run ```npm install``` and ```npm run start:dev``` for a responsive server or ```npm start``` for a static server  

