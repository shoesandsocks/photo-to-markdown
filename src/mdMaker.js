let template = `
---
date: DATE
title: TITLE
tags:
  - TAG
  - TAG
  - TAG
  - TAG
  - TAG
  - TAG
  - TAG
---

![DESCRIPTION](./FILENAME)

BODY
`;

const mdMaker = (obj) => {
  console.log(`obj is ${JSON.stringify(obj)}`)
  const { filename, tags, description, date, title, body } = obj;
  let fileDate = new Date(date);
  if (typeof fileDate.getMonth !== 'function') {
    fileDate = new Date();
  }
  let fileTitle = title;
  if (typeof fileTitle !== 'string') {
    fileTitle = ''
  }
  let fileBody = body;
  if (typeof fileBody !== 'string') {
    fileBody = ''
  }
  let fileDescription = description;
  if (typeof fileDescription !== 'string') {
    fileDescription = 'this post was auto-generated without alt text'
  }
  let fileTags = tags;
  if (!Array.isArray(fileTags)) {
    fileTags = ['auto-generated'];
  }
  let newfile = template
    .replace('DATE', fileDate)
    .replace('TITLE', fileTitle)
    .replace('BODY', fileBody)
    .replace('FILENAME', filename)
    .replace('DESCRIPTION', fileDescription);
  fileTags.forEach(tag => {
    newfile = newfile.replace(/  -TAG/, tag);
  })
  newfile = newfile.replace(/  - TAG\n/g, '')
  console.log(newfile)
  return newfile;
}


export default mdMaker;
