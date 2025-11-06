import Url from '../model/URL.js'
import {nanoid} from 'nanoid'


export const createUrl = (async (req, res) => {
  const { longUrl } = req.body;
   try {
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.send(url);
    } else {
      let urlCode = nanoid()
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
    res.status(500).json({ error: "Invalid Request" });
  }
});



export const redirect = (async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.redirect });
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


