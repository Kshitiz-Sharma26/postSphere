import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/drzuhbx8a/image/upload/v1741922899/xrgawjwjvkkwbluen9du.avif",
    },
    requests: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    friends: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
  },
  { timestamps: true }
);

// This middleware runs before saving the document to convert password into a hash
userSchema.pre("save", async function (next) {
  // Hash password only when field password is modified, Mongoose can track if
  // the password field of document is explicitly modified,
  // e.g. user.password = "new password";
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

const User = userSchema.model("user", userSchema);

export default User;
