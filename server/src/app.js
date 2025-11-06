import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import urlRoutes from './routes/urlRoutes.js'
const app = express();
app.use(express.json());
app.use('/api', urlRoutes)

const PORT = process.env.PORT;
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongodb Connected");
  } catch (err) {
    console.error(err.message);
  }
};
connectdb();

app.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
});
