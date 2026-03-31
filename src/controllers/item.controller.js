import { Item } from "../model/item.model.js";

export const createItem = async (req, res) => {
  try {
    const { itemName, price, quantity, description, status } = req.body;
    const userId = req.userId;

    const item = await Item.create({
      itemName,
      price,
      quantity,
      description,
      status,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const userId = req.userId;

    const items = await Item.findAll({ where: { userId } });

    return res.json({ success: true, items });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, price, quantity, description, status } = req.body;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.update({
      itemName,
      price,
      quantity,
      description,
      status,
    });

    return res.json({
      success: true,
      message: "Item updated",
      item,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await item.destroy();

    return res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
