import { dmsToDecimal } from './functions.js'

export default (exifArray) => {
  return new Promise((resolve, reject) => {

    resolve(exifArray.map(exif => {
      const { filename, gps } = exif;
      const {
        GPSLatitude,
        GPSLatitudeRef,
        GPSLongitude,
        GPSLongitudeRef,
      } = gps;

      let lat = dmsToDecimal(GPSLatitude)
      if (GPSLatitudeRef === "S") lat *= -1
      let lon = dmsToDecimal(GPSLongitude)
      if (GPSLongitudeRef === "W") lon *= -1

      const filetype = filename.split('.')[1];
      const file = filename.split('.')[0];
      const thumb = file + "_thumb." + filetype;

      return {
        filename, lat, lon, thumb
      }
      // marker = new google.maps.Marker({
      //   position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      //   map: map,
      //   data: {
      //     name: locations[i][0]
      //   }
      // });
      // marker.addListener('click', function() {
      //   if(!this.infoWindow) {
      //     this.infoWindow = new google.maps.InfoWindow({
      //       content: this.data.name,
      //     });
      //   }
      //   this.infoWindow.open(map,this);
      // })

      // save the above for front-end code.
      // return array pushed full of relevant data objects:
      // - filename
      // - thumbnail name
      // - string description
      // - lat long
    }));
    reject(new Error("How'd you get here?"))
  })
}
