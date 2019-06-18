
import path from 'path'
import sharp from 'sharp'

import { ExifImage } from 'exif'
import { exec } from 'child_process';

export const dmsToDecimal = (array) => {
  const d = array[0]
  const m = array[1]
  const s = array[2]
  return Number(d) + Number(m/60) + Number(s/3600)
}

export const makeThumbnail = (filename, width) => {
  const image = path.resolve(process.cwd(), 'public/photos/', filename)
  let thumbname = `${width}px-${filename}`
  sharp(image)
    .resize({ width: 400 })
    .toFile(path.resolve(process.cwd(), 'public/generatedThumbs/', thumbname));
};

export const getExif = (filename, kml = false) => {
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
          if (kml) {
            resolve({...exifData, filename}) // send ALLL the data to the kml func
          }
          // callback
          if (error) {
            if (error.code === 'NOT_A_JPEG') {
              console.log(`not-a-jpeg error (hopefully it's a png)`)
            } else if (error.code === 'NO_EXIF_SEGMENT') {
              console.log('no exif found')
            } else {
              console.log(error)
            }
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

export const limitFiletypes = str => {
  const filetype = path.parse(str).ext
  return ['.jpeg', '.jpg', '.png'].includes(filetype.toLowerCase())
}