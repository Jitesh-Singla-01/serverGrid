import User from "../models/User.js";
import dotenv from "dotenv";
// import { Configuration, OpenAiApi } from "openai";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const apiCall = async (txtPromt) => {
  const res = await openai.images.generate({
    prompt: txtPromt,
    n: 2,
    size: "512x512",
  });
  return res["data"];
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function dumyStringGenerator(user) {
  return `generate fashion outfit for a ${user.age} ${user.gender} inclusive with latest trends`;
}

async function update(user, userId, txt) {
  user.preference.push(txt);

  const userNew = await User.findByIdAndUpdate(
    { _id: userId },
    {
      preference: user.preference,
    },
    { new: true }
  );
}

export const getPicsIntial = async (req, res) => {
  try {
    const { userId } = req.query;
    let images;

    const user = await User.findById(userId);
    if (user.preference.length === 0) {
      const txt = dumyStringGenerator(user);
      images = await apiCall(txt);
      update(user, userId, txt);
    } else {
      const randInd = getRndInteger(0, user.preference.length);
      images = await apiCall(user.preference[randInd]);
    }
    return res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPics = async (req, res) => {
  try {
    const { userId, prompTxt } = req.body;
    const user = await User.findById(userId);
    const images = await apiCall(prompTxt);
    update(user, userId, prompTxt);
    return res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
