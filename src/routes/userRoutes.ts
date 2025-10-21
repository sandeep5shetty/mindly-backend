import { Router } from "express";
import { parse } from "path";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserModel } from "../db/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  //zod input validation
  const requiredBody = z.object({
    username: z.string().min(3, "ithna small").max(25),
    password: z.string().min(3).max(35),
    firstName: z.string().min(3).max(35),
    lastName: z.string().min(3).max(35).optional(),
  });

  const parsedData = requiredBody.safeParse(req.body);

  if (parsedData.success) {
    const hashedPass = await bcrypt.hash(parsedData.data.password, 5);
    try {
      const response = await UserModel.create({
        username: parsedData.data.username,
        password: hashedPass,
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
      });
    } catch (error) {
      res.status(402).json({ errorMsg: "Username already exists in the DB" });
    }
    res.status(200).json({ msg: "Chalo Jii Suceessfully signed UP" });
  } else {
    res.status(404).json({ msg: "Inputs are wrong" });
  }
});

userRouter.post("/signin", async (req, res) => {
  //zod input validation
  const requiredBody = z.object({
    username: z.string().min(3, "ithna small").max(25),
    password: z.string().min(3).max(35),
  });

  const parsedData = requiredBody.safeParse(req.body);

  if (parsedData.success) {
    try {
      const user = await UserModel.findOne({
        username: parsedData.data.username,
      });
      if (user) {
        const match = await bcrypt.compare(
          parsedData.data.password,
          String(user.password)
        );
        if (match) {
          //@ts-ignore
          const token = jwt.sign(String(user.username), process.env.JWT_SECRET);
          res
            .status(200)
            .json({ msg: "Chalo Jii Suceessfully signed In ", token });
        } else {
          res.status(403).json({ errorMsg: "Password is Wrong" });
        }
      } else {
        res.status(403).json({ errorMsg: "User doesn't exists" });
      }
    } catch (error) {
      res.status(402).json({ errorMsg: "Username already exists in the DB" });
    }
  } else {
    res.status(404).json({ msg: "Inputs are wrong" });
  }
});
