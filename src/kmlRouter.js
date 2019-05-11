import express from 'express'
import fs from 'fs'
import path from 'path'

import { getExif, limitFiletypes } from './functions';
import createKmlFile from './createKmlFile';

const kmlRouter = express.Router()

kmlRouter.use('/', (req, res) => {
  let imageFiles = []
  try {
    imageFiles = fs.readdirSync(path.resolve('./public/photos'))
    // imageFiles = imageFiles.map(name => sanitize(name))
  } catch (e) {
    console.log(`no photos: ${e}`)
  }
  try {
    Promise.all(imageFiles.filter(limitFiletypes).map(file => getExif(file, true))) // bool to get all EXIF data (see other func)
      .then(async (exifArray) => {
        const kmlFile = await createKmlFile(exifArray);
        return res.render('make-kml', { data: kmlFile, route: 'make-kml' })
      })
  } catch {
    return res.render('make-kml', { data: kmlFile, route: 'make-kml' })
  }
})

export default kmlRouter
