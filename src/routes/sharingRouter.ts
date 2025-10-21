import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ContentModel } from "../db/db.js";

export const sharingRouter = Router();

sharingRouter.post("/", authMiddleware, async (req, res) => {
  console.log("User whose data to be shared : ", req.userId);

  try {
    const contents = await ContentModel.find({
      userId: req.userId,
    });

    const sharableLink = `${process.env.DOMAIN_BASE_URL}/api/v1/contents/?id=${req.userId}`;

    res.status(201).json({
      message: "Sharable link generated successfully",
      link: sharableLink,
    });
  } catch (error) {
    console.log("Errror occured : ", error);
  }
});
