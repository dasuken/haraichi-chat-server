const mongoose = require('mongoose')

const ResponseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  radioName: {
    type: String,
    requried: true,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
})

module.exports = mongoose.model('Response', ResponseSchema);