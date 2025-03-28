import express from "express";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// Middleware for handling CORS and JSON data
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (_, res) => res.send("Server is up and running!"));

app.use("/contacts", contactRoutes);

export { app };
