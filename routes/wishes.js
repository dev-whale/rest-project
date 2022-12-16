const express = require('express')
const router = express.Router()
const Wish = require('../models/wish')
const Category = require('../models/category')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Wishes Route
router.get('/', async (req, res) => {
  let query = Wish.find().populate('category')
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const wishes = await query.exec()
    res.render('wishes/index', {
      wishes: wishes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


router.get('/new', async (req, res) => {
  renderNewPage(res, new Wish())
})


router.post('/', async (req, res) => {
  const wish = new Wish({
    title: req.body.title,
    category: req.body.category,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(wish, req.body.cover)

  try {
    const newWish = await wish.save()
    res.redirect(`wishes/${newWish.id}`)
  } catch {
    renderNewPage(res, wish, true)
  }
})


router.get('/:id', async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id).populate('category').exec()
    res.render('wishes/show', { wish: wish })
  } catch {
    res.redirect('/')
  }
})


router.get('/:id/edit', async (req, res) => {
  try {
    const wish = await Wish.findById(req.params.id)
    renderEditPage(res, wish)
  } catch {
    res.redirect('/')
  }
})


router.put('/:id', async (req, res) => {
  let wish

  try {
    wish = await Wish.findById(req.params.id)
    wish.title = req.body.title
    wish.category = req.body.category
    wish.publishDate = new Date(req.body.publishDate)
    wish.pageCount = req.body.pageCount
    wish.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(wish, req.body.cover)
    }
    await wish.save()
    res.redirect(`/wishes/${wish.id}`)
  } catch {
    if (wish != null) {
      renderEditPage(res, wish, true)
    } else {
      redirect('/')
    }
  }
})


router.delete('/:id', async (req, res) => {
  let wish
  try {
    wish = await Wish.findById(req.params.id)
    await wish.remove()
    res.redirect('/wishes')
  } catch {
    if (wish != null) {
      res.render('wishes/show', {
        wish: wish,
        errorMessage: 'Could not remove wish'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, wish, hasError = false) {
  renderFormPage(res, wish, 'new', hasError)
}

async function renderEditPage(res, wish, hasError = false) {
  renderFormPage(res, wish, 'edit', hasError)
}

async function renderFormPage(res, wish, form, hasError = false) {
  try {
    const categories = await Category.find({})
    const params = {
      categories: categories,
      wish: wish
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Wish'
      } else {
        params.errorMessage = 'Error Creating Wish'
      }
    }
    res.render(`wishes/${form}`, params)
  } catch {
    res.redirect('/wishes')
  }
}

function saveCover(wish, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    wish.coverImage = new Buffer.from(cover.data, 'base64')
    wish.coverImageType = cover.type
  }
}

module.exports = router