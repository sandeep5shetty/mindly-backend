import express from "express";
import { userRouter } from "./routes/userRoutes.js";
import { contentRouter } from "./routes/contentRoutes.js";
import { sharingRouter } from "./routes/sharingRouter.js";
import { sharedContentsRouter } from "./routes/sharedContentsRouter.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/contents", sharedContentsRouter);
app.use("/api/v1/share", sharingRouter);

app.listen(3002, () => {
  console.log("Server is up AND it is running at PORT 3002");
});
