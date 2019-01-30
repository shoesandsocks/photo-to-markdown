import express from 'express';
import fs from 'fs';
import path from 'path';

import { ExifImage } from 'exif';

function getExif(filename) {
  return new Promise(
    function (resolve, reject) {
      const failSuccessfully = () => resolve({
        filename,
        dateProcessed: new Date(),
        originalDate: new Date(),
        noExif: true,
      })
      try {
        new ExifImage(
          { image : path.resolve(process.cwd(), 'photos/', filename) }, // object
          function (error, exifData) {                                  // callback
            if (error) return failSuccessfully();
            console.log(`eee: ${exifData}`)
            if (
              !exifData ||
              !exifData.exif ||
              !exifData.exif.CreateDate) {
                return failSuccessfully();
              }
            const CreateDate = exifData.exif.CreateDate;
            const jsReadyDate = CreateDate.replace(/:/,'-').replace(/:/,'-').replace(' ', 'T')
            const utcDate = new Date(jsReadyDate);
            const adjustedEasternDate = utcDate.setHours(utcDate.getHours() - 5)
            resolve({
              filename,
              dateProcessed: new Date(),
              originalDate: new Date(adjustedEasternDate),
              noExif: false,
            })
          });
        } catch (e) {return failSuccessfully()}
    }
  );

}

const imageFiles = fs.readdirSync(path.resolve('./photos'))

const exifArray = [];

imageFiles.forEach((file) => {
  getExif(file).then(reply => exifArray.push(reply));
});

const photoRouter = express.Router();
photoRouter.use('/admin', (req, res) => {
  res.render('index', {
    data: exifArray
  })
})

export default photoRouter;