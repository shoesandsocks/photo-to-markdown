// const isValidDate = date => Boolean(+date) && date.getDate() == day
// // https://medium.com/@esganzerla/simple-date-validation-with-javascript-caea0f71883c

// let template = `---
// date: 'DATE'
// title: 'TITLE'
// tags:
// TAG---

// ![DESCRIPTION](./FILENAME)

// BODY
// `

/* NEXT TEMPLATE IS FOR PUPPYREY.ONLINE. VERY ANNOYING 
* does not accomodate alt-text/description, works awkwardly.
* solution is to rebuild puppyrey.online and re-do markdowns...
*/

let template = `---
date: 'DATE'
title: 'TITLE'
slug: 'SLUG'
mfphoto:
  - 'FILENAME'
tags:
TAG---

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
  const year = saveDate.getFullYear()
  const month = saveDate.getMonth() + 1
  const datee = saveDate.getDate()

  let fileDate = new Date(date)
  if (isNaN(fileDate)) {
    fileDate = new Date()
  }
  const fileTitle = typeof title !== 'string' ? '' : title
  const fileBody = typeof body !== 'string' ? '' : body
  // const fileDescription =
  //   typeof description !== 'string' || description === ''
  //     ? 'this post was auto-generated without alt text'
  //     : description

  const tagArray = [...new Set(tags.split(',').map(tag => tag.trim()))]
  let tagsStringed = ''
  if (
    !Array.isArray(tagArray) ||
    (tagArray.length === 1 && tagArray[0] === '')
  ) {
    tagsStringed = '  - rey\n'
  } else {
    tagArray.forEach(tag => (tagsStringed += `  - ${tag}\n`))
  }

  const newfile = template
    .replace('DATE', fileDate.toISOString())
    .replace('TITLE', fileTitle)
    .replace('BODY', fileBody)
    .replace('FILENAME', `${year}-${month}-${datee}-${filename}`) // for puppyrey. could just be 'filename'
    // .replace('DESCRIPTION', fileDescription) // OFF for puppyrey.online
    .replace('SLUG', slug) // optional? need for puppyrey.online
    .replace('TAG', tagsStringed)

  return newfile
}

export default mdMaker
