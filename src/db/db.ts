import mongoose, { mongo, Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const ObjectId = mongoose.Types.ObjectId;

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/mindly");

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
export const UserModel = mongoose.model("users", UserSchema);

const TagSchema = new Schema(
  {
    title: { type: String, unique: true },
  },
  { timestamps: true }
);
export const TagModel = mongoose.model("tags", TagSchema);

const contentTypes = ["facebook", "youtube", "linkedin", "insta", "x", "other"];

const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    type: { type: String, enum: contentTypes, required: true },
    tags: [{ type: ObjectId, ref: "tags" }],
    userId: { type: ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

export const ContentModel = mongoose.model("Contents", ContentSchema);

const LinksSchema = new Schema(
  {
    hash: String,
    sharable: Boolean,
    userId: { type: ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);
export const LinksModel = mongoose.model("links", LinksSchema);
