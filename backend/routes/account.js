const express = require("express");
const { authMiddleware } = require("../authMiddleware");

const { Account } = require("../db.js");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
  //already passes authmiddleware, means user definately exists
  const userId = req.userId;

  const accountInfo = await Account.findOne({ userId });

  return res.status(200).json({
    balance: accountInfo.balance,
  });
});

// router.post("/transfer", authMiddleware, async (req, res) => {
//   const { amount, to } = req.body;

//   const account = await Account.findOne({
//     userId: req.userId,
//   });

//   if (account.balance < amount) {
//     return res.status(400).json({
//       message: "Aukaat mein rho!!",
//     });
//   }

//   const toAccount = await Account.findOne({
//     userId: to,
//   });

//   if (!toAccount) {
//     return res.status(400).json({
//       message: "Invalid account",
//     });
//   }

//   await Account.updateOne(
//     {
//       userId: req.userId,
//     },
//     {
//       $inc: { balance: -amount },
//     }
//   );

//   await Account.updateOne(
//     {
//       userId: to,
//     },
//     {
//       $inc: {
//         balance: amount,
//       },
//     }
//   );

//   res.json({
//     message: `₹${amount} transferred successfully.`,
//   });
// });

// router.post("/transfer", authMiddleware, async (req, res) => {
//   const session = await mongoose.startSession();

//   session.startTransaction();
//   const { amount, to } = req.body;

//   //Fetch the account within the transaction
//   const account = await Account.findOne({ userId: req.userId }).session(
//     session
//   );

//   if (!account || account.balance < amount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Insufficient Balance",
//     });
//   }

//   const toAccount = await Account.findOne({ userId: to }).session(session);

//   if (!toAccount) {
//     await session.abortTransaction();
//     return res.status(400).json({
//       message: "Invalid account",
//     });
//   }

//   //Perform the transfer
//   await Account.updateOne(
//     { userId: req.userId },
//     { $inc: { balance: -amount } }
//   ).session(session);

//   await Account.updateOne(
//     { userId: to },
//     { $inc: { balance: amount } }
//   ).session(session);

//   //commit the transaction
//   await session.commitTransaction();

//   res.json({
//     message: "Transfer Successful",
//   });
// });

router.post("/transfer", authMiddleware, async function transfer(req, res) {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    console.log("Insufficient balance");
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    console.log("Invalid account");
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();
  res.status(200).json({
    message: "Transfer Successful",
  });
});

module.exports = router;
