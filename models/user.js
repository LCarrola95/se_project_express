const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(avatar) {
        return validator.isURL(avatar);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    select: false,
  },
});

userSchema.pre("save", async function preSave(next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Incorrect email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect email or password");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
