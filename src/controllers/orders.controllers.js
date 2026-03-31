import { Order } from "../model/orders.model.js";
import { User } from "../model/user.model.js";

const validStatuses = ["pending", "processing", "completed", "cancelled"];

export const createOrder = async (req, res) => {
  try {
    const { productName, quantity, price, status } = req.body;
    const userId = req.user.id;

    // Validate status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
        data: null,
      });
    }

    // Create the order
    const order = await Order.create({
      productName,
      quantity,
      price,
      status,
      userId,
    });

    // Fetch the order including user details
    const orderWithUser = await Order.findOne({
      where: { id: order.id },
      include: [
        {
          model: User,
          attributes: [
            "id",
            "name",
            "email",
            "phone",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Order created successfully",
      data: orderWithUser,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: error.message },
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({ where: { userId } });

    return res.status(200).json({
      statusCode: 200,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: error.message },
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, quantity, price, status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "Order not found",
        data: null,
      });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        statusCode: 400,
        message: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
        data: null,
      });
    }

    await order.update({ productName, quantity, price, status });

    return res.status(200).json({
      statusCode: 200,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: error.message },
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "Order not found",
        data: null,
      });
    }

    await order.destroy();

    return res.status(200).json({
      statusCode: 200,
      message: "Order deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: error.message },
    });
  }
};
