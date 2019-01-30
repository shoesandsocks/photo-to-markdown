import express from 'express'

// import fs from 'fs'
// import path from 'path'

const photoRouter = express.Router()
photoRouter.post('/', (req, res) => {
  console.log(req.fields)
  res.redirect('/admin')
})

export default photoRouter
