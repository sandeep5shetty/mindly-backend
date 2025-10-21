import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UserModel } from "../db/db.js";
import mongoose, { mongo } from "mongoose";
import { createLanguageService } from "typescript";

const ObjectId = mongoose.Types.ObjectId;

declare global {
  namespace Express {
    interface Request {
      email: string;
      password: string;
      userId?: typeof ObjectId;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const token = String(req.headers.authorization);
    // @ts-ignore

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const user = await UserModel.findOne({ username: decoded });
      //@ts-ignore
      req.userId = user?._id;
      next();
    } else {
      return res.status(401).json({ errorMsg: "Error while validating User" });
    }
  } catch (error: any) {
    return res.status(404).json({ errorMsg: error.message });
  }
};
