const express = require("express");
const { authMiddleware } = require("../authMiddleware.js");
const z = require("zod");
const User = require("../db.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  secondName: z.string(),
  password: z.string(),
});

const searchQuery = z.object({
  filter: z.string().min(3),
});

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const signinBody = z.object({
  username: z.string().email(),
  password: z.string(),
});

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);

  console.log(User);

  if (!success) {
    return res.status(401).json({
      message: "Invalid Inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already taken/ Incorrect Inputs",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    secondName: req.body.secondName,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET
  );

  res.json({
    message: "User created successfully",
    token: token,
  });
});

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    return res.status(401).json({
      message: "Incorrect Inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(401).json({
      message: "User don't exits",
    });
  }

  console.log(user);
  const isPasswordCorrect = await user.validatePassword(req.body.password);
  if (isPasswordCorrect) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      message: "SignedIn Successfully!! Here is your token",
      token: token,
    });
    return;
  }

  res.status(401).json({
    message: "Invalid Credentials",
  });
});

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);

  if (!success) {
    res.status(411).json({
      message: "Invalid input for update",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Profile Update Successfully",
  });
});

router.get("/bulk", async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const { success } = searchQuery.safeParse({ filter });
    if (!success) {
      return res.status(400).json({
        message: "Invalid Search Query",
      });
    }
    //i => ignore case in regex
    const users = await User.find({
      $or: [
        { firstName: new RegExp(`.*${filter}.*`, "i") },
        { secondName: new RegExp(`.*${filter}.*`, "i") },
      ],
    });

    return res.status(200).json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        secondName: user.secondName,
        _id: user._id,
      })),
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
