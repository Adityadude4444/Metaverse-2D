import { Router } from "express";

export const adminRouter = Router();

adminRouter.get("/avatar", (req, res) => {});

adminRouter.get("/map", (req, res) => {});

adminRouter.put("/element/:elementId", (req, res) => {});

adminRouter.post("/element", (req, res) => {});
