import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

enum UserStatus {
  inactive = 0,
  active = 1,
  blocked = 2,
}

export interface UserInput {
  email: string;
  password: string;
  userAgent: string;
  clientIp: string;
}

export interface UserDocument extends Omit<UserInput, "ip">, Document {
  _id: mongoose.Types.ObjectId;
  status: UserStatus;
  ips: string[];
  activationToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    userAgent: { type: String },
    status: {type: Number, default: 0},
    ips: [{ type: String, default: [] }],
    activationToken: {type: String, default: ""}
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  const activationToken = crypto.randomBytes(64).toString("hex");
  user.activationToken = activationToken;

  next();
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
