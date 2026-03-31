import express from "express";
import {
  createItem,
  getMyItems,
  updateItem,
  deleteItem,
} from "../controllers/item.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createItem);
router.get("/my-items", authMiddleware, getMyItems);
router.put("/update/:id", authMiddleware, updateItem);
router.delete("/delete/:id", authMiddleware, deleteItem);

export default router;
