import connectionPool from "../utils/db.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const isUser = await connectionPool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (isUser.rows[0]) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const userData = {
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    await connectionPool.query(
      "INSERT INTO users (email, password, created_at, updated_at) VALUES ($1, $2, $3, $4)",
      [
        userData.email,
        userData.password,
        userData.created_at,
        userData.updated_at,
      ]
    );
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }

  return res.status(201).json({
    message: "User registered successfully",
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const isUser = await connectionPool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!isUser.rows[0]) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    const user = isUser.rows[0];

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid user credentials",
      });
    }

    const accessToken = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User login successfully",
      accessToken,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
