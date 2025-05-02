import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import projectRoute from './routes/projectRoute.js';
import facultyRoute from './routes/facultyRoute.js';
import studentRoute from './routes/studentRoute.js';
import groupRoute from './routes/groupRoute.js'
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// connection with DB
connectDB();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/v2/auth',authRoute); 
app.use('/api/v2/student',studentRoute);
app.use('/api/v2/faculty',facultyRoute);
app.use('/api/v2/project',projectRoute);
app.use('/api/v2/group',groupRoute)

export default app;
