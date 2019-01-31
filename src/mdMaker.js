// const isValidDate = date => Boolean(+date) && date.getDate() == day
// // https://medium.com/@esganzerla/simple-date-validation-with-javascript-caea0f71883c

let template = `---
date: DATE
title: TITLE
tags:
TAG---

![DESCRIPTION](./FILENAME)

BODY
`

const mdMaker = obj => {
  const { filename, tags, description, date, title, body } = obj

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
    .replace('DATE', fileDate)
    .replace('TITLE', fileTitle)
    .replace('BODY', fileBody)
    .replace('FILENAME', filename)
    .replace('DESCRIPTION', fileDescription)
    .replace('TAG', tagsStringed)

  return newfile
}

export default mdMaker
