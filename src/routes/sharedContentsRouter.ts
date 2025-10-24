import mongoose, { isObjectIdOrHexString } from "mongoose";
import { hex } from "zod/mini";
import { tagsMiddleware } from "../middlewares/tagsMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Router } from "express";
import { ContentModel, LinksModel } from "../db/db.js";
import { link } from "fs";
import { tr } from "zod/locales";

export const sharedContentsRouter = Router();

sharedContentsRouter.get("/", async (req, res) => {
  const hash = req.query.id;

  //check if it is available for share

  const links = await LinksModel.findOne({ hash: hash, sharable: true });

  if (links) {
    try {
      const userId = links.userId;
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Link does not reference a user" });
      }

      const response = await ContentModel.find({ userId });

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
  } else {
    res.status(404).json({ message: "No sharable content found" });
  }
});
