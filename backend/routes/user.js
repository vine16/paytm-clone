const express = require("express");
const { authMiddleware } = require("../authMiddleware.js");
const z = require("zod");
const { User, Account } = require("../db.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  secondName: z.string(),
  password: z.string().min(6),
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
  console.log(req.body);
  if (!success) {
    console.log("Invalid Inputs");
    return res.status(401).json({
      message: "Invalid Inputs",
    });
  }

  try {
    const existingUser = await User.findOne({
      username: req.body.username,
    });

    console.log(existingUser, "existingUser");
    if (existingUser) {
      return res.status(409).json({
        message: "Email already Registered. Please SignIn",
      });
    }

    const { username, password, firstName, secondName } = req.body;
    console.log(username, password, firstName, secondName);
    const user = await User.create({
      username: username,
      password: password,
      firstName: firstName,
      secondName: secondName,
    });

    const userId = user._id;

    await Account.create({
      userId,
      balance: 1 + Math.random() * 10000,
    });

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log("Error in creating user", error);
    res.status(401).json({
      message: "server error",
    });
  }
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
      user,
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

    console.log(users, ">>>");
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
