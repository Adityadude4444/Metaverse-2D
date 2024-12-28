import express from "express";
import { router } from "./routes/v1";
const app = express();

import client from "@repo/db/client";

app.use("/api/v1", router);

app.listen(5000);
