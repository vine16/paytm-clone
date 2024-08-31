const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const DB_URL = process.env.MONGODB_URL;
console.log(DB_URL);
mongoose.connect(DB_URL);

// Check if the connection is successful
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Handle connection errors
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  firstName: { type: String, required: true, trim: true, maxLength: 50 },
  secondName: { type: String, required: true, trim: true, maxLength: 50 },
  password: { type: String, required: true, minLength: 6 },
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  balance: {
    type: Number,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate(); //this refer to query object in updateOne, not document
  if (update.password) {
    try {
      const hashedPassword = await bcrypt.hash(update.password, 10);
      update.password = hashedPassword;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.validatePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password); //this => current document
};

const Account = mongoose.model("Account", accountSchema);
const User = mongoose.model("Person", userSchema);

module.exports = {
  User,
  Account,
};
