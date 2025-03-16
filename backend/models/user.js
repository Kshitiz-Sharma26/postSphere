import mongoose from "mongoose";

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

const User = userSchema.model("user", userSchema);

export default User;
