const express = require("express");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const userRoutes = require("./userRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);

// Future lectures plug in here, e.g.:
// router.use("/cart", cartRoutes);
// router.use("/orders", orderRoutes);

module.exports = router;
