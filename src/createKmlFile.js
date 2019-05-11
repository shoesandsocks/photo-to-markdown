const rootURL = 'https://www.porknachos.com/notifier/file'

const clean = string => string.replace(/_/g, ' ').replace(/\.(jpg|png|JPG|PNG)/, "")

const dmsToDecimal = (array) => {
  const d = array[0]
  const m = array[1]
  const s = array[2]
  return Number(d) + Number(m/60) + Number(s/3600)
}

const templateHead = 
`<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns=\"http://www.opengis.net/kml/2.2\">
<Document>
<open>1</open>
<description>DESCRIPTION</description>
`

const templateFoot =
`</Document>
</kml>`

export default (exifArray) => {
  return new Promise((resolve, reject) => {
    if (exifArray.length == 0) reject(new Error('No data in array.'))
    let kmlLayerFile = templateHead;
    const filenames = [];
    exifArray.forEach(exif => {
      const { filename, gps } = exif;
      // console.log(filename, gps);
      const {
        GPSLatitude,
        GPSLatitudeRef,
        GPSLongitude,
        GPSLongitudeRef,
        GPSAltitude,
        GPSAltitudeRef
      } = gps;

      let lat = dmsToDecimal(GPSLatitude)
      if (GPSLatitudeRef === "S") lat *= -1
      let lon = dmsToDecimal(GPSLongitude)
      if (GPSLongitudeRef === "W") lon *= -1
      const alt = GPSAltitude
      if (GPSAltitudeRef === 1) alt *= 1 // right? underwater?
      if (lat && lon && alt) {
        kmlLayerFile +=
`<Placemark><name>${clean(filename)}</name>
<description>
<![CDATA[
<a href="${rootURL}/${filename}">
<img src="${rootURL}/${filename}" width=200 />
</a>
]]>
</description>
<Point>
<coordinates>${lon},${lat},${alt}</coordinates>
</Point>
</Placemark>`
        filenames.push(filename);
      } else {
        console.log(`not importing ${filename}. Missing EXIF data.`)
      }
    });

    kmlLayerFile += templateFoot;

    // console.log(file)
    resolve({ filenames, kmlLayerFile});
  })
}