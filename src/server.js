import express from "express";
import mainRouter from "./routes/index.routes.js";
import { connectDB, sequelize } from "./config/db.js";

const app = express();
// Sync Sequelize models (alter = true for dev)
connectDB();
sequelize.sync({ force: true }); // drops & recreates tables
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Use all routes from router folder
app.use("/api", mainRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
