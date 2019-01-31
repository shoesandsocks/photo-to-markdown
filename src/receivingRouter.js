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
  const month = saveDate.getMonth()
  const date = saveDate.getDate()
  const slug =
    req.fields.title !== ''
      ? slugged(req.fields.title)
      : req.fields.filename.split('.')[0]
  const folder = path.resolve(__dirname, '../markdown-posts')

  // make md file from fields
  const md = mdMaker({ ...req.fields })

  // write file and copy photo
  console.log(`${folder}/${year}-${month + 1}-${date}-${slug}`)
  fs.writeFileSync(`/${folder}/${year}-${month}-${date}-${slug}.md`, md)

  // remove photo from original list

  // return user to admin
  return res.redirect('/admin')
})

export default photoRouter
