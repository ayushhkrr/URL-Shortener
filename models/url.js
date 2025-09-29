import mongoose from 'mongoose'

const urlSchema = new mongoose.Schema({
   urlCode: String,
   longUrl: {type: String, require: true},
   shortUrl: {type: String, require: true},
   date: {type: Number, default: Date.now}
})

const Url = mongoose.model('Url', urlSchema)
export default Url

