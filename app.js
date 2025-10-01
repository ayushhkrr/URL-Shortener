import express from "express";
import mongoose from "mongoose";
import shortid from "shortid";
import dotenv from "dotenv";
import Url from "./Models/URL.js";
const app = express();
app.use(express.json());
dotenv.config();
const PORT = process.env.PORT;
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Mongodb Connected");
  } catch (err) {
    console.error(err.message);
  }
};
connectdb();

app.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  

  try {
    let url = await Url.findOne({longUrl});
    if (url) {
      return res.send(url);
    } else {
      let urlCode = shortid.generate();
      let shortUrl = `${process.env.BASE_URL}/${urlCode}`;
      url = new Url({
        longUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      });
      await url.save();
      res.status(201).json(url);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({error:"Invalid Request"});
  }
});

    app.get('/all', async(req, res)=>{
      try{
        const links = await Url.find({})
        res.json(links)
      }catch(err){
        console.error(err)
        res.status(500).json('Server Error')
      }
    })

app.get('/:redirect', async(req, res)=>{
  try{
    const url = await Url.findOne({urlCode: req.params.redirect})
    if(url){
     return res.redirect(url.longUrl)
    }else{
     return res.status(404).json('Url Not Found')
    }
  }catch(err){
    console.error(err)
    res.status(500).json('server error')
  }
})

app.delete('/:id', async(req, res)=>{
      try{
        const id = await Url.findByIdAndDelete(req.params.id)
        if (id){
         return res.status(200).json({message: 'Yay Url Got Deleted'})
        }else{
          return res.status(404).json('Not Found')
        }
      }catch(err){
        console.error(err)
        res.status(500).json('Server Error')
      }
})

app.listen(PORT, () => {
  console.log(`The server is running on PORT ${PORT}`);
});
