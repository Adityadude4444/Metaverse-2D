import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SignupSchema } from "../../types";
import client from "@repo/db/client";
export const router = Router();

router.post("/signup", async (req, res) => {
  const parsedata = SignupSchema.safeParse(req.body);
  if (!parsedata.success) {
    res.status(400).json({
      message: "Invalid Data",
    });
    return;
  }
  try {
    const user = await client.user.create({
      data: {
        username: parsedata.data.username,
        password: parsedata.data.password,
        role: parsedata.data.type === "admin" ? "Admin" : "User",
      },
    });
  } catch (error) {}

  res.json({
    message: "Signup",
  });
});

router.post("/signup", (req, res) => {});

router.get("/elements", (req, res) => {});

router.get("/avatars", (req, res) => {});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
