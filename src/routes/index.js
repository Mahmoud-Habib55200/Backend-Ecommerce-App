const express = require("express");
const authRoutes = require("./authRoutes");

const router = express.Router();

router.use("/auth", authRoutes);

// Future lectures plug in here, e.g.:
// router.use("/products", productRoutes);
// router.use("/cart", cartRoutes);
// router.use("/orders", orderRoutes);

module.exports = router;
