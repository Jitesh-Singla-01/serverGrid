import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes of app
app.use("/auth", authRoutes);
// app.use("/post", postRoutes);
// app.use("/user", userRoutes);
app.use("/images", imageRoutes);
// app.use("/comments", comentRoutes);
// app.use("/teams", teamRoutes);
// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.KEY, // defaults to process.env["OPENAI_API_KEY"]
// });

// const res = await openai.images.generate({
//   prompt: "modern outfit for a 19 year old male",
//   n: 4,
//   size: "512x512",
// });
// console.log(res["data"]);

const url = process.env.MONGO_URL;
const PORT = 3001;
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(PORT));
  })
  .catch((error) => console.log(error));
