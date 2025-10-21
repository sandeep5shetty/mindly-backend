import mongoose, { isObjectIdOrHexString } from "mongoose";
import { hex } from "zod/mini";
import { tagsMiddleware } from "../middlewares/tagsMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
import { ContentModel } from "../db/db.js";

export const sharedContentsRouter = Router();

sharedContentsRouter.get("/", async (req, res) => {
  const id = req.query.id;

  try {
    const response = await ContentModel.find({ userId: id });

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
