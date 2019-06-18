import express from 'express'
import fs from 'fs'
import path from 'path'

import { getExif, limitFiletypes, makeThumbnail } from './functions';
import createKmlFile from './createKmlFile';
import { thumbWidth } from './config';

const kmlRouter = express.Router()

kmlRouter.use('/', (req, res) => {
  let imageFiles = []
  try {
    imageFiles = fs.readdirSync(path.resolve('./public/photos'))
  } catch (e) {
    console.log(`no photos: ${e}`)
  }
  try {
    Promise.all(imageFiles.filter(limitFiletypes).map(file => getExif(file, true))) // bool to get all EXIF data (see other func)
      .then(async (exifArray) => {
        exifArray.forEach(file => {
          console.log(file.filename);
          makeThumbnail(file.filename, thumbWidth);
        });
        const kmlFile = await createKmlFile(exifArray, thumbWidth);
        return res.render('make-kml', { data: kmlFile, route: 'make-kml' })
      })
  } catch {
    return res.render('make-kml', { data: {}, route: 'make-kml' })
  }
})

export default kmlRouter
