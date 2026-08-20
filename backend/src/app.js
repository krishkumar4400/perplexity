import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH"],
  }),
);

// routes


export default app;
