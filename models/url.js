import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  userId: String,
  longUrl: {type: String,required: true},
  shortUrl: { type: String, required: true },
  urlCode: { type: String, required: true },
  Date: { type: Number, default: Date.now },
});

const Url = mongoose.model("Url", urlSchema);
export default Url;
