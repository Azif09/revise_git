// src/config/db.js
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("postgres", "postgres", "avez1234", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};
