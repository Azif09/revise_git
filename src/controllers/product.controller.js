import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";

export const createProduct = async (req, res) => {
  try {
    const { productName, price, stock, description } = req.body;
    const userId = req.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const product = await Product.create({
      productName,
      price,
      stock,
      description,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const userId = req.userId;

    const products = await Product.findAll({ where: { userId } });

    return res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, price, stock, description } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({
      productName,
      price,
      stock,
      description,
    });

    return res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    return res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
