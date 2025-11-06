import Url from '../model/URL.js'
import {nanoid} from 'nanoid'


export const createUrl = (async (req, res) => {
  try {
     const { longUrl } = req.body;
    if(!/^https?:\/\/.+/.test(longUrl)){
        return res.status(400).json({message: 'Please enter a valid url'})
      }
      const correctUrl = longUrl.trim().replace(/\/+$/, '')
    let url = await Url.findOne({ longUrl: correctUrl });
    if (url) {
      return res.status(200).json(url);
    } else {
      
      let urlCode = nanoid()
      let shortUrl = `${process.env.BASE_URL}/${urlCode}`;
      url = new Url({
        longUrl: correctUrl,
        shortUrl,
        urlCode,
        date: new Date(),
      });
      await url.save();
      res.status(201).json(url);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Invalid Request" });
  }
});



export const redirect = (async (req, res) => {
  try {
    const {redirect} = req.params
    if(!redirect || redirect.trim() === ''){
      return res.status(400).json({message: 'Invalid short URL code'})
    }
    const url = await Url.findOne({urlCode: redirect.trim()})
    if(!url){
      return res.status(404).json({message: 'URL not found'})
    }
    try {
  new URL(url.longUrl);
} catch {
  return res.status(400).json({ message: 'Invalid destination URL' });
}
    return res.redirect(url.longUrl)
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "server error"});
  }
});


