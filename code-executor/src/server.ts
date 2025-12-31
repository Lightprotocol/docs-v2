import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { executeCode } from "./executor.js";

const app = express();
const PORT = process.env.PORT || 3040;
const API_KEY = process.env.EXECUTOR_API_KEY;

if (!API_KEY) {
  console.error("EXECUTOR_API_KEY environment variable is required");
  process.exit(1);
}

app.use(helmet());
app.use(express.json({ limit: "50kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/typescript", authMiddleware, async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Invalid request: code is required" });
    return;
  }

  if (code.length > 10000) {
    res.status(400).json({ error: "Code too long (max 10KB)" });
    return;
  }

  try {
    const result = await executeCode(code);
    res.json(result);
  } catch (error) {
    console.error("Execution error:", error);
    res.status(500).json({
      error: "Execution failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Code executor running on port ${PORT}`);
});

