import mongoose from "mongoose";

const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  username: {
    type: String,
    required: true,
    unique: [true],
  },
  email: {
    type: String,
    required: true,
    unique: [true],
  },
  password: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    // required: true,
  },
  role: {
    type: Number,
    default: 1,
  },
  isActived: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  job: {
    type: String,
    default: "Freelancer",
  },
  phone: {
    type: Number,
    default: 0,
  },
});

const UserTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expires: {
    type: String,
    required: true,
  },
});

export const UserModel = mongoose.model("Users", UserSchema);
export const UserTokenModel = mongoose.model("UserToken", UserTokenSchema);
