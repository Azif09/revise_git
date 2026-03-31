import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orders.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createOrder", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/update/:id", authMiddleware, updateOrder);
router.delete("/delete/:id", authMiddleware, deleteOrder);

export default router;
