import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isValidEmail, isStrongPassword } from "../utils/validators.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });

  if (!isValidEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email" });

  if (!isStrongPassword(password))
    return res.status(400).json({ success: false, message: "Password too weak" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ success: false, message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  res.json({ success: true, message: "Registered successfully" });
};
