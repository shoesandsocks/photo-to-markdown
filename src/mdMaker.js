/**
 * exported function mdMaker returns a blog-post style markdown file from a given object
 * - the template for the markdown is hard coded but easily changed
 * - the object must have properties { filename, tags, description, date, title, body },
 *    although the function's logic can deal with *some* errors
 * 
 */
let template = `---
date: 'DATE'
title: 'TITLE'
slug: 'SLUG'
mf_photo:
  - 'FILENAME'
tags:
TAG---

![DESCRIPTION](FILENAME)

BODY
`

/* brittle but works */
const slugged = text => text.replace(/ /g, '-')

const mdMaker = obj => {
  const { filename, tags, description, date, title, body } = obj
  const slug = title !== '' ? slugged(title) : filename.split('.')[0]
  
  let saveDate = new Date(date)
  if (isNaN(saveDate)) {
    saveDate = new Date()
  }
  // const year = saveDate.getFullYear()
  // const month = saveDate.getMonth() + 1
  // const day = saveDate.getDate()

  let fileDate = new Date(date)
  if (isNaN(fileDate)) {
    fileDate = new Date()
  }
  const fileTitle = typeof title !== 'string' ? '' : title
  const fileBody = typeof body !== 'string' ? '' : body
  const fileDescription =
    typeof description !== 'string' || description === ''
      ? 'this post was auto-generated without alt text'
      : description

  const tagArray = [...new Set(tags.split(',').map(tag => tag.trim()))]
  let tagsStringed = ''
  if (
    !Array.isArray(tagArray) ||
    (tagArray.length === 1 && tagArray[0] === '')
  ) {
    tagsStringed = '  - auto-generated\n'
  } else {
    tagArray.forEach(tag => (tagsStringed += `  - ${tag}\n`))
  }

  const newfile = template
    .replace('DATE', fileDate.toISOString())
    .replace('TITLE', fileTitle)
    .replace('BODY', fileBody)
    .replace('FILENAME', `./assets/${filename}`)
    .replace('FILENAME', `./assets/${filename}`) // i'm so lazy
    .replace('DESCRIPTION', fileDescription)
    .replace('SLUG', slug) // optional? 
    .replace('TAG', tagsStringed)

  return newfile
}

export default mdMaker
