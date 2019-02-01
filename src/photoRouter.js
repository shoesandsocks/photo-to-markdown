import express from 'express'
import fs from 'fs'
import path from 'path'

import { ExifImage } from 'exif'

// function getAllExif (arrayOfFilenames) {
//   return new Promise (function (resolve, reject) {

//   })
// }

function getExif (filename) {
  return new Promise(function (resolve, reject) {
    const failSuccessfully = () =>
      resolve({
        filename,
        dateProcessed: new Date(),
        originalDate: new Date(),
        noExif: true
      })
    try {
      new ExifImage(
        { image: path.resolve(process.cwd(), 'public/photos/', filename) }, // object
        function (error, exifData) {
          // callback
          if (error) {
            if (error.code === 'NOT_A_JPEG') {
              console.log('not-a-jpeg error')
            }
            console.log(error)
            return failSuccessfully()
          }
          if (!exifData || !exifData.exif || !exifData.exif.CreateDate) {
            return failSuccessfully()
          }
          const CreateDate = exifData.exif.CreateDate
          const jsReadyDate = CreateDate.replace(/:/, '-')
            .replace(/:/, '-')
            .replace(' ', 'T')
          const utcDate = new Date(jsReadyDate)
          const adjustedEasternDate = utcDate.setHours(utcDate.getHours() - 5)
          resolve({
            filename,
            dateProcessed: new Date(),
            originalDate: new Date(adjustedEasternDate),
            noExif: false
          })
        }
      )
    } catch (e) {
      return failSuccessfully()
    }
  })
}

const limitFiletypes = str => {
  const suffix = str.split('.')[1].toLowerCase()
  return ['jpeg', 'jpg', 'png'].includes(suffix)
}

const photoRouter = express.Router()

photoRouter.use('/', (req, res) => {
  const imageFiles = fs.readdirSync(path.resolve('./public/photos'))

  Promise.all(
    imageFiles.filter(limitFiletypes).map(file => getExif(file))
  ).then(exifArray => res.render('admin', { data: exifArray }))
  /* callback to .map() returns array of promises, so wrapping in
   * Promise.all and chaining with a .then() that contains
   * the res.render gives us the async behavior we need
   * (instead of a hacky settimeout)
   */
})

export default photoRouter
