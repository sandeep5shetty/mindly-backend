import { response, Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ContentModel } from "../db/db.js";
import { parse } from "path";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { hex } from "zod/mini";
import { tagsMiddleware } from "../middlewares/tagsMiddleware.js";

export const contentRouter = Router();

contentRouter.put(
  "/create",
  authMiddleware,
  tagsMiddleware,
  async (req: Request, res: Response) => {
    //zod input validate
    const requiredBody = z.object({
      link: z.string(),
      type: z.string(),
      title: z.string(),
      tags: z.any().array().optional(),
    });
    const parsedData = requiredBody.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        error: "Invalid input",
        details: parsedData.error,
      });
    }

    try {
      const response = await ContentModel.create({
        link: parsedData.data.link,
        type: parsedData.data.type,
        title: parsedData.data.type,
        //@ts-ignore
        tags: parsedData.data.tags,
        userId: req.userId,
      });
      res.status(201).json({
        message: "Content created successfully",
        data: response,
      });
    } catch (error: any) {
      console.log("evesdgvrsd", error.message);
      return res
        .status(500)
        .json({ msg: "Error while creating content in DB" });
    }
  }
);

contentRouter.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const response = await ContentModel.find({ userId: req.userId });

    if (response) {
      res.status(200).json({
        message: "All contents retrieved successfully",
        data: response,
      });
    } else {
      res.status(400).json({ msg: "No Documents Found" });
    }
  } catch (error) {
    console.log("Error fetching from DB");
  }
});

contentRouter.delete(
  "/",
  authMiddleware,
  async (req: Request, res: Response) => {
    const id = req.query.id;
    try {
      const deletedContent = await ContentModel.deleteOne({ _id: id });
      if (deletedContent) {
        res.status(202).json({ message: "Content deleted successfully" });
      } else {
        res.status(404).json({ message: "Content Not Found " });
      }
    } catch (error) {
      res.status(401).json({ errorMsg: "Error while deleting content" });
    }
  }
);
