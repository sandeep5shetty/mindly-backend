import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ObjectId = mongoose.Types.ObjectId;

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mindly");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
});
export const UserModel = mongoose.model("users", UserSchema);

const TagSchema = new Schema({
  title: { type: String, unique: true },
});
export const TagModel = mongoose.model("tags", TagSchema);

const contentTypes = ["image", "video", "article", "audio"];

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: ObjectId, ref: "tags" }],
  userId: { type: ObjectId, ref: "users", required: true },
});

export const ContentModel = mongoose.model("contents", ContentSchema);
