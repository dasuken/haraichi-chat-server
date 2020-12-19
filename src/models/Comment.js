const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  radioName: {
    type: String,
    requried: true,
  },
  themeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
  likes: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Comment', CommentSchema);