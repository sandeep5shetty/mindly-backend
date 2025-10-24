import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ContentModel, LinksModel } from "../db/db.js";
import generateHash from "../config/hashGenerate.js";
import { link } from "fs";

export const sharingRouter = Router();

sharingRouter.post("/", authMiddleware, async (req, res) => {
  console.log("User whose data to be shared: ", req.userId);

  const toShare = req.body.share;
  let hash;
  let isAlreadyHashed;
  const response = await LinksModel.findOne({ userId: req.userId });
  if (response) {
    isAlreadyHashed = true;
    hash = response.hash;
  }

  if (toShare) {
    try {
      if (isAlreadyHashed) {
        await LinksModel.updateOne(
          { hash: hash },
          { sharable: true },
          { upsert: false }
        );
      } else {
        hash = generateHash(12);
        const response = await LinksModel.create({
          hash: hash,
          userId: req.userId,
          sharable: true,
        });
      }
      const sharableLink = `${process.env.DOMAIN_BASE_URL}/api/v1/contents/?id=${hash}`;

      res.status(203).json({
        msg: "Now you can share your content with others",
        hash,
        link: sharableLink,
      });
    } catch (error) {
      res.status(401).json({ msg: "Error while generating hash for sharing " });
    }
  } else {
    if (isAlreadyHashed) {
      await LinksModel.updateOne(
        { hash: hash },
        { sharable: false },
        { upsert: false }
      );
    }
    res.status(203).json({
      msg: "Now only you can see your contents",
    });
  }
});

/* 

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { ContentModel, LinksModel } from "../db/db.js";
import generateHash from "../config/hashGenerate.js";
import { link } from "fs";

export const sharingRouter = Router();

sharingRouter.post("/", authMiddleware, async (req, res) => {
  console.log("User whose data to be shared: ", req.userId);

  const toShare = req.body.share;
  let hash;
  let isAlreadyHashed = true;
  if (toShare) {
    try {
      const response = await LinksModel.findOne({ userId: req.userId });
      if (response) {
        isAlreadyHashed = true;
        hash = response.hash;
      } else {
        hash = generateHash(12);
        const response = await LinksModel.create({
          hash: hash,
          userId: req.userId,
          sharable: true,
        });
      }

      const sharableLink = `${process.env.DOMAIN_BASE_URL}/api/v1/contents/?id=${hash}`;

      res.status(203).json({
        msg: "Now you can share your content with others",
        hash,
        link: sharableLink,
      });
    } catch (error) {
      res.status(401).json({ msg: "Error while generating hash for sharing " });
    }
  } else {
    try {
      if (isAlreadyHashed) {
        await LinksModel.updateOne(
          { hash: hash },
          { sharable: false },
          { upsert: false }
        );
      }
      res.status(203).json({ msg: "Now only you can see your contents" });
    } catch (error) {
      res.status(401).json({ msg: "Error while disabling sharing " });
    }
  }

  /* try {
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
  } */
