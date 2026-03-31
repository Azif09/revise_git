import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Invalid email format" },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isNumeric: { msg: "Phone number must contain only digits" },
        len: {
          args: [10, 10],
          msg: "Phone number must be exactly 10 digits",
        },
      },
    },

    otp: {
      type: DataTypes.STRING,
    },

    otpExpires: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);
