import mongoose, { Schema, Document } from "mongoose";

export enum UserStatus {
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
    status: { type: Number, default: 0 },
    ips: [{ type: String, default: [] }],
    activationToken: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
