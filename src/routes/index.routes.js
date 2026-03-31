import express from "express";
import authRoutes from "../routes/auth.routes.js";
import orderRoutes from "../routes/orders.routes.js";
import productRoutes from "../routes/product.routes.js";
import itemRoutes from "../routes/item.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/order", orderRoutes);
router.use("/products", productRoutes);
router.use("/items", itemRoutes);


export default router;
