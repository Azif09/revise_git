import express from "express";
import {
  signUp,
  login,
  verifyOtp,
  updateUser,
  deleteUser,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { readProfile } from "../controllers/auth.controllers.js";
const router = express.Router();

// SIGNUP
router.post("/signup", signUp);

// LOGIN
router.post("/login", login);

// VERIFY OTP
router.post("/verify-otp", verifyOtp);

// PROFILE
router.get("/profile", authMiddleware, readProfile);

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
