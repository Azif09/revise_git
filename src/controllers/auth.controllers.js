import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";
import { Op } from "sequelize";
import { response } from "../utils/response.utils.js";
import * as customerService from "../service/customer.service.js";

const SECRET_KEY = "MY_SECRET_KEY";

// SIGNUP
export const signUp = async (req, res) => {
  try {
    const data = req.body;
    console.log(`data - ${JSON.stringify(data)}`);

    const createUSer = await customerService.createCustomer(data);
    return res.send(response(201, "Success", createUSer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "User ID and password are required",
        data: null,
      });
    }

    // Find user by primary key (id)
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid User ID",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        statusCode: 400,
        message: "Incorrect password",
        data: null,
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP valid 5 mins
    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "OTP sent successfully",
      data: { userId: user.id, otp },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: err.message },
    });
  }
};

// VERIFY LOGIN
export const verifyOtp = async (req, res) => {
  try {
    const { id, otp } = req.body; // use id instead of emailOrPhone

    if (!id || !otp) {
      return res.status(400).json({
        statusCode: 400,
        message: "User ID and OTP are required",
        data: null,
      });
    }

    // Find user by primary key
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "User not found",
        data: null,
      });
    }

    // Check OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        statusCode: 400,
        message: "Incorrect OTP",
        data: null,
      });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({
        statusCode: 400,
        message: "OTP expired",
        data: null,
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Clear OTP
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      statusCode: 200,
      message: "OTP verified successfully",
      data: { token },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { error: err.message },
    });
  }
};

// PROFILE
export const readProfile = (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(404).json({
      statusCode: 404,
      message: "User not found",
      data: null,
    });
  }

  res.status(200).json({
    statusCode: 200,
    message: "Profile fetched successfully",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      countryCode: user.countryCode,
      fullPhone: user.fullPhone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, countryCode, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // PHONE VALIDATION
    if (phone && (phone.length !== 10 || isNaN(phone))) {
      return res.status(400).json({ message: "Phone must be 10 digits" });
    }

    // COUNTRY CODE VALIDATION
    if (
      countryCode &&
      (countryCode[0] !== "+" || isNaN(countryCode.slice(1)))
    ) {
      return res.status(400).json({ message: "Invalid country code" });
    }

    // DUPLICATE CHECK
    const duplicateUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone }],
        id: { [Op.ne]: id },
      },
    });

    if (duplicateUser) {
      return res
        .status(400)
        .json({ message: "Email or Phone already used by another user" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.countryCode = countryCode || user.countryCode;
    user.fullPhone =
      countryCode && phone ? countryCode + phone : user.fullPhone;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      statusCode: 200,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
