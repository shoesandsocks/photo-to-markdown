import express from 'express'
import path from 'path'

import photoRouter from './routes/photoRouter'

const app = express();
const port = process.env.PORT || 3001;
app.set('view engine', 'ejs');

console.log( path.join(__dirname, '../photos'))
app.use('/photos', express.static(path.join(__dirname, '../photos')))
app.use(photoRouter)


app.listen(port, () => console.log(`on ${port}`))