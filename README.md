# Photo Markdowner

## Makes markdown-style blog posts from a folder of photos

### How to use & customize

Clone the repo, `cd` into it, `npm run dev`.° That's it.

Put your photos in the `public/photos` folder. Navigate to the `/admin` page. There you can edit
the date (it will hopefully be populated with the photo's creation date, if your pics have valid
EXIF encoded in them), and add a title, description, and tags.

When you submit an entry, it is validated and converted to a markdown
file, ready to be copied into your .md-capable blog. Markdown files should start to pop up in
the `markdown-posts` folder.

Obvious(?) note: Your blog's markdown files are different from mine; adjust the template at the top
of `src/mdMaker.js` as appropriate - whatever frontmatter you want, whether you want
more/other content in the body of each post... it's maybe not for beginners, but I think
it's easy enough for a hobbyist to figure out. For that matter, it wouldn't be too
tough to add additional fields to the form then use the data from those fields in the
`mdMaker.`

---

° <sub> It uses [Backpack](https://www.npmjs.com/package/backpack-core)
under the hood (overkill for a small project but I like it); running in dev mode seems harmless enough.</sub>