// order_items is aliased to `products`, and users to `userId`, so the order
// components keep reading `order.products` and `order.userId.name` exactly as
// they did with Mongoose's embedded array and .populate().

const ORDER_BASE =
  "id, totalAmount, stripeSessionId, paymentStatus, orderStatus, shippingDetails, createdAt, updatedAt, products:order_items(id, productId, productName, quantity, price)";

export const ORDER_FIELDS = `${ORDER_BASE}, userId`;

// The embedded customer is aliased to `userId`, so the raw `userId` column is
// left out -- asking for both would put the same key in the row twice.
export const ADMIN_ORDER_FIELDS = `${ORDER_BASE}, userId:users(id, name, email, phone, address, city, state, country, pincode)`;
