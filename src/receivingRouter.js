import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import mdMaker from "./mdMaker.js";
import { rey } from "./config.js";

const fail = (res) => res.redirect("/make-posts");

const requiredFields = [
  "date",
  "filename",
  "description",
  "tags",
  "body",
  "title",
];

const photoRouter = express.Router();
photoRouter.post("/", (req, res) => {
  // validate POSTed fields
  const found = Object.keys(req.fields).every((key) =>
    requiredFields.includes(key)
  );
  if (!found) return fail(res);
  // setup a bunch of variables
  let saveDate = new Date(req.fields.date);
  if (isNaN(saveDate)) {
    console.log("cannot parse given date");
    saveDate = new Date();
  }
  const year = saveDate.getFullYear().toString();
  let month = (saveDate.getMonth() + 1).toString();
  month = month.padStart(2, "0");
  let day = saveDate.getDate().toString();
  day = day.padStart(2, "0");

  const { filename } = req.fields;
  const slug = Math.floor(Math.random() * 90000) + 10000;

  const markdownFolder = path.resolve(__dirname, "../markdown-posts");
  const existingPhotoFolder = path.resolve(__dirname, "../public/photos");
  // make md file from fields
  const md = mdMaker({ ...req.fields, slug, year, month, day }); // passing date comps in case mdMaker needs(e.g. for rey blog)

  // write file and copy photo
  fs.writeFileSync(`${markdownFolder}/${year}-${month}-${day}-${slug}.md`, md);

  if (rey) {
    fs.copyFileSync(
      `${existingPhotoFolder}/${filename}`,
      `${markdownFolder}/${year}-${month}-${day}-${slug}-${filename}` // to conform to rey blog file style
    );
    // N.B.: The slug is needed in filename b/c reyblog uses slug to build posts.
    // really needs to be re-architected over there, to simplify here, but emojishrug.
  } else
    fs.copyFileSync(
      `${existingPhotoFolder}/${filename}`,
      `${markdownFolder}/${filename}`
    );

  // remove photo from original list
  fs.unlinkSync(`${existingPhotoFolder}/${filename}`);

  // return user to make-posts
  return res.redirect("/make-posts");
});

export default photoRouter;
