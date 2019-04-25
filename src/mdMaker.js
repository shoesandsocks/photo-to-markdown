import rey from './config'

var template = `---
date: DATE
title: TITLE
tags:
TAG---

![DESCRIPTION](./FILENAME)

BODY
`

if (rey) {
  template = `---
date: DATE
title: TITLE
slug: 'SLUG'
mfphoto:
  - 'https://puppyrey.online/src/pages/images/FILENAME'
category: social
tags:
TAG  - rey
---

BODY
`
}



const mdMaker = obj => {
  const { tags, description, date, title, body, slug, year, month, day } = obj
  let filename = obj.filename; // might get reassigned

  let fileDate = new Date(date)
  if (isNaN(fileDate)) {
    fileDate = new Date()
  }
  fileDate = fileDate.toISOString()

  let fileTitle = typeof title !== 'string' ? '' : title
  if (fileTitle === '') { fileTitle = "''"} // to get actual quotes into md

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

  if (rey) {
    filename = `${year}-${month}-${day}-${slug}-${filename}`;
  }

  const newfile = template
    .replace('DATE', fileDate)
    .replace('TITLE', fileTitle)
    .replace('BODY', fileBody)
    .replace('FILENAME', filename)
    .replace('DESCRIPTION', fileDescription)
    .replace('TAG', tagsStringed)

  if (rey) {
    return newfile.replace('SLUG', slug)
  } else {
    return newfile
  }
  // return newfile
}

export default mdMaker
