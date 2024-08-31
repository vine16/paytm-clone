const express = require("express");

const router = express.Router();
const userRouter = require("./user");
const accountRouter = require("./account");
const { authMiddleware } = require("../authMiddleware");

router.get("/hello", (req, res) => {
  res.send("hello from server");
});

router.use("/user", userRouter);
router.use("/account", accountRouter);
router.use("/verify-token", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Token verified Successfully",
  });
});
module.exports = router;
