import express from "express";
import fs from "fs";
import path from "path";

import { getExif, limitFiletypes } from "./functions.js";

const photoRouter = express.Router();

photoRouter.use("/", (req, res) => {
  let imageFiles = [];
  try {
    imageFiles = fs.readdirSync(path.resolve("./public/photos"));
    // imageFiles = imageFiles.map(name => sanitize(name))
  } catch (e) {
    console.log(`no photos: ${e}`);
  }
  Promise.all(
    imageFiles.filter(limitFiletypes).map((file) => getExif(file))
  ).then((exifArray) =>
    res.render("make-posts", { data: exifArray, route: "make-posts" })
  );
  /* callback to .map() returns array of promises, so wrapping in
   * Promise.all and chaining with a .then() that contains
   * the res.render gives us the async behavior we need
   * (instead of a hacky settimeout)
   */
});

export default photoRouter;
