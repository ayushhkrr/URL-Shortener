import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  urlCode: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
