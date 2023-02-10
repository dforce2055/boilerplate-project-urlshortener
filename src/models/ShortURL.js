let mongoose = require('mongoose')

let urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    required: true
  },
})

module.exports = mongoose.model('ShortURL', urlSchema)