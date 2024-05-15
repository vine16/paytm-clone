const express = require("express");

const router = express.Router();
const userRouter = require("./user");
router.get("/hello", (req, res) => {
  res.send("hello from server");
});

router.use("/user", userRouter);

module.exports = router;
