import express from "express";
import mongoose from "mongoose";
import shortid from "shortid";
import dotenv from "dotenv";

import Url from "./models/url.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message);
  }
};

connectdb();
app.post("/shortener", async (req, res) => {
  const { longUrl } = req.body;
  const baseUrl = `http://localhost:${process.env.PORT}`;

  try {
    let url = await Url.findOne({ longUrl });
    if (url) {
      res.json(url);
    } else {
      const urlCode = shortid.generate();
      const shortUrl = `${baseUrl}/${urlCode}`;
      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      });
      await url.save();
      res.json(url);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});
app.get("/all-links", async (req, res) => {
  try {
    const allLinks = await Url.find({});
    res.json(allLinks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Invalid request" });
  }
});
app.get("/:transfer", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.transfer });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("Url Not Found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("server error");
  }
});
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUrl = await Url.findByIdAndDelete(id);
    if (!deleteUrl) {
      return res.status(404).json({ message: "URL not found" });
    }
    res.json({ message: "Url Sucessfully Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errror: "Server Error" });
  }
});
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
