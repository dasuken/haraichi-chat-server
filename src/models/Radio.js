const mongoose = require('mongoose')
const { NIL } = require('uuid')

const RadioSchema = new mongoose.Schema({
  times: {
    type: Number,
    required: true
  },
  youtubeUrl: {
    type: String
  },
  themes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Theme'
  },
  broadCastingDate: String,
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
},{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
})

RadioSchema.virtual('themeImage').get(function() {
  let image
  if (this.themes) {
    image = this.themes[0].thumbnail
    if (!image) image = "https://static.tbsradio.jp/wp-content/uploads/2020/05/hp_haraichi_0501.jpg"
  } else {
    image = "https://static.tbsradio.jp/wp-content/uploads/2020/05/hp_haraichi_0501.jpg"
  }
  return image
})

module.exports = mongoose.model('Radio', RadioSchema);