import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client";
import { compare, hash } from "../../scrypt";
import { JWT_SECRET } from "../../config";
const express = require("express");
const jwt = require("jsonwebtoken");
export const router = Router();
router.use(express.json());
router.post("/signup", async (req, res) => {
  console.log("inside signup");

  // Log the request body
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  // Validate the request body
  const parsedData = SignupSchema.safeParse(req.body);

  if (!parsedData.success) {
    // Log detailed validation errors
    console.log("Validation Error:", parsedData.error.errors);
    res
      .status(400)
      .json({ message: "Validation failed", errors: parsedData.error.errors });
    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({ userId: user.id });
  } catch (e) {
    console.log("Error:", e);
    res.status(400).json({ message: "User already exists" });
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({ message: "Validation failed" });
    return;
  }

  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    const isValid = await compare(parsedData.data.password, user.password);

    if (!isValid) {
      res.status(403).json({ message: "Invalid password" });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (e) {
    res.status(400).json({ message: "Internal server error" });
  }
});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
