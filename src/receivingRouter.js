import express from 'express'

import mdMaker from './mdMaker'
import fs from 'fs'
import path from 'path'

const fail = res => res.redirect('/admin')

const slugged = text => text.replace(/ /g, '-')
const requiredFields = [
  'date',
  'filename',
  'description',
  'tags',
  'body',
  'title'
]

const photoRouter = express.Router()
photoRouter.post('/', (req, res) => {
  // validate POSTed fields
  const found = Object.keys(req.fields).every(key =>
    requiredFields.includes(key)
  )
  if (!found) return fail(res)
  // setup a bunch of variables
  let saveDate = new Date(req.fields.date)
  if (isNaN(saveDate)) {
    saveDate = new Date()
  }
  const year = saveDate.getFullYear()
  const month = saveDate.getMonth() + 1
  const date = saveDate.getDate()
  const { filename, title } = req.fields
  const slug = title !== '' ? slugged(title) : filename.split('.')[0]
  const markdownFolder = path.resolve(__dirname, '../markdown-posts')
  const existingPhotoFolder = path.resolve(__dirname, '../public/photos')
  // make md file from fields
  const md = mdMaker({ ...req.fields })

  // write file and copy photo
  fs.writeFileSync(`${markdownFolder}/${year}-${month}-${date}-${slug}.md`, md)
  fs.copyFileSync(
    `${existingPhotoFolder}/${filename}`,
    `${markdownFolder}/${filename}`
  )
  // remove photo from original list
  fs.unlinkSync(`${existingPhotoFolder}/${filename}`)

  // return user to admin
  return res.redirect('/admin')
})

export default photoRouter
