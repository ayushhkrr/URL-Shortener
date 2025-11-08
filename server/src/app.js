import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import urlRoutes from "./routes/urlRoutes.js";
import { rateLimit } from "express-rate-limit";
import cors from 'cors'

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'https://url-shortener-eight-pink.vercel.app'],
  credentials: true
}))
app.use(express.json());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: "Too many requests, try again later." },
});

app.use("/api", limiter);
app.use("/api", urlRoutes);




app.use((err, req, res, next)=>{
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong on our side. Please try again later.'
  })
})

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
    app.listen(PORT, () => {
      console.log(`The server is running on PORT ${PORT}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1)
  }
};
connectdb();