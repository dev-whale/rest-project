const mongoose = require('mongoose')
const Wish = require('./wish')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  coverImage: {
    type: Buffer
  },
  coverImageType: {
    type: String
  }
})

categorySchema.pre('remove', function(next) {
  Wish.find({ category: this.id }, (err, wishes) => {
    if (err) {
      next(err)
    } else if (wishes.length > 0) {
      next(new Error('This category is not empty'))
    } else {
      next()
    }
  })
})

categorySchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Category', categorySchema)