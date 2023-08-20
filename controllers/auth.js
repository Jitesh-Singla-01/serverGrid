import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/otp.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
dotenv.config();

const sendEmail = async (email, OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.OWNER_EMAIL,
      pass: process.env.OWNER_PASS,
    },
  });
  const mailOptions = {
    from: process.env.OWNER_EMAIL,
    to: email,
    subject: "Social media ",
    text: `Your Otp is ${OTP}`,
  };
  var sended = await transporter.sendMail(mailOptions);
  return sended;
};

export const signUp = async (req, res) => {
  const OTP = otpGenerator.generate(6, {
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });
  console.log(OTP);
  const email = req.body.email;
  const salt = await bcrypt.genSalt();
  const otpHash = await bcrypt.hash(OTP, salt);
  const otp = new Otp({ email: email, otp: otpHash });
  await otp.save();
  sendEmail(email, OTP)
    .then((info) => {
      return res.status(200).send("OTP sended successfully");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Unable to process please try again");
    });
};

export const verifyOtp = async (req, res) => {
  const otpHolder = await Otp.find({ email: req.body.email });
  const n = otpHolder.length;
  if (n === 0) return res.send(false);
  const validOtp = await bcrypt.compare(req.body.otp, otpHolder[n - 1].otp);
  if (validOtp) {
    await Otp.deleteMany({ email: otpHolder[0].email });
    res.send(true);
  } else {
    res.send(false);
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password, gender, age } = req.body;

    const salt = await bcrypt.genSalt();
    // console.log(password);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      gender,
      age,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist ." });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const jsonToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ jsonToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
