import express from 'express'

import mdMaker from './mdMaker'
// import fs from 'fs'
// import path from 'path'

const fail = res => res.redirect('/admin');

const requiredFields = ['date', 'filename', 'description', 'tags', 'body', 'title']

const photoRouter = express.Router()
photoRouter.post('/', (req, res) => {
  // validate POSTed fields
  const found = Object.keys(req.fields).every(key => requiredFields.includes(key))
  if (!found) return fail(res);

  // make md file from fields
  const md = mdMaker({...req.fields})

  // write file and copy photo

  // remove photo from original list

  // return user to admin
  return res.redirect('/admin');
})

export default photoRouter
