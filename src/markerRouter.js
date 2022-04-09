import express from "express";
import fs from "fs";
import path from "path";

import { getExif, limitFiletypes } from "./functions.js";
import createMarkers from "./createMarkers.js";

const markerRouter = express.Router();

markerRouter.use("/", (req, res) => {
  let imageFiles = [];
  try {
    imageFiles = fs.readdirSync(path.resolve("./public/photos"));
    // imageFiles = imageFiles.map(name => sanitize(name))
  } catch (e) {
    console.log(`no photos: ${e}`);
  }
  try {
    Promise.all(
      imageFiles.filter(limitFiletypes).map((file) => getExif(file, true))
    ) // bool to get all EXIF data (see other func)
      .then(async (exifArray) => {
        const markers = await createMarkers(exifArray);
        console.log("oh", markers);
        return res.render("make-markers", {
          data: markers,
          route: "make-markers",
        });
      });
  } catch {
    return res.render("make-markers", { data: {}, route: "make-markers" });
  }
});

export default markerRouter;
