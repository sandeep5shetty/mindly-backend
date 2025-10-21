import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const sharingRouter = Router();

sharingRouter.post("/", authMiddleware, (req, res) => {
  console.log("User whose data to be shared : ", req.userId);
});
