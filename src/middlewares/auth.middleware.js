import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const SECRET_KEY = "MY_SECRET_KEY";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        statusCode: 401,
        message: "No token provided",
        data: null,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        data: null,
      });
    }

    req.user = user; // attach user object
    next();
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid or expired token",
      data: null,
    });
  }
};
