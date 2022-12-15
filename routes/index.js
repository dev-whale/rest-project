const express = require('express')
const router = express.Router()
const Wish = require('../models/wish')
const Category = require('../models/category')

router.get('/', async (req, res) => {
  let categories
  let wishes
  try {
    wishes = await Wish.find().sort({ createdAt: 'desc' }).limit(10).populate('category').exec()
    categories  = await Category.find().limit(10)
  } catch {
    wishes = []
    categories = []
  }
  res.render('index', { wishes: wishes, categories: categories })
})

module.exports = router