import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "../generated/prisma/index.js";

// Import routes
import adminAuthRoutes from "./routes/adminAuth.js";
import schemeServiceRoutes from "./routes/schemeService.js";
import certificateServiceRoutes from "./routes/certificateService.js";
import contactServiceRoutes from "./routes/contactService.js";
import officeManagementRoutes from "./routes/officeManagement.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:8080",
      "http://localhost:8081",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Routes
app.use("/api/auth", adminAuthRoutes);
app.use("/api/scheme-services", schemeServiceRoutes);
app.use("/api/certificate-services", certificateServiceRoutes);
app.use("/api/contact-services", contactServiceRoutes);
app.use("/api/offices", officeManagementRoutes);

app.get("/api/test", (req, res) => {
  res.json({ status: "OK", message: "Test route working" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Something went wrong!",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  },
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { prisma };
export default app;
