import express from "express";
import { getPicsIntial, getPics } from "../controllers/imageGen.js";

const router = express.Router();

router.get("/", getPicsIntial);
router.post("/", getPics);

export default router;
