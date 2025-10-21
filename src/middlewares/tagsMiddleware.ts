import type { Request, Response, NextFunction } from "express";
import { TagModel } from "../db/db.js";

export const tagsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.tags || !Array.isArray(req.body.tags)) {
      return res.status(400).json({ error: "Tags must be an array" });
    }

    const tagPromises = req.body.tags.map(async (tag: string) => {
      let tagRef = await TagModel.findOne({ title: tag });

      if (!tagRef) {
        console.log(`Tag "${tag}" not found, creating new tag`);
        tagRef = await TagModel.create({ title: tag });
        console.log(`Created new tag with id: ${tagRef._id}`);
      } else {
        console.log(`Found existing tag with id: ${tagRef._id}`);
      }

      return tagRef._id;
    });

    const tagObjectIds = await Promise.all(tagPromises);

    req.body.tags = tagObjectIds;
    next();
  } catch (error: any) {
    console.error("Error in tagsMiddleware:", error.message);
    res.status(400).json({
      error: "Failed to process tags",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
