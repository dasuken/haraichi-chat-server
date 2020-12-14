const mongoose = require('mongoose')

const ThemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: "https://static.tbsradio.jp/wp-content/uploads/2020/05/hp_haraichi_0501.jpg"
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment'
  },
  radioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Radio'
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
  description: {
    type: String
  }
})
// Date.now を変えるかも string
module.exports = mongoose.model('Theme', ThemeSchema);