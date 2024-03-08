import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import ApiError from "../utils/error.js";
import asyncHandler from "../utils/async.js";
import checkPermissions from "../utils/checkPermissions.js";

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

const createOrder = asyncHandler(async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1) {
    throw new ApiError(500, "No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new ApiError(500, "Please provide tax and shipping fee");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new ApiError(500, `No product with id ${item.product}`);
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "inr",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(201).json({ order, clientSecret: order.clientSecret });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});
  res.status(200).json({ orders, count: orders.length });
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new ApiError(500, `No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(200).json({ order });
});

const getCurrentUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(200).json({ orders, count: orders.length });
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new ApiError(500, `No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(200).json({ order });
});

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrder,
  createOrder,
  updateOrder,
};
