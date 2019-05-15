import express from 'express'
import path from 'path'
import formible from 'express-formidable'

import photoRouter from './photoRouter'
import receivingRouter from './receivingRouter'
import kmlRouter from './kmlRouter'
import markerRouter from './markerRouter'

const port = process.env.PORT || 3001
const app = express()

app.set('view engine', 'ejs')

app.use(formible()) // to get fields and files form form-data submissions

app.use('/public', express.static(path.join(__dirname, '../public')))

app.use('/make-kml', kmlRouter)
app.use('/make-posts', photoRouter)
app.use('/make-markers', markerRouter)
app.use('/receiving', receivingRouter)

app.get('/', (req, res) => res.render('index', {route: 'root'}))
app.get('/about', (req, res) => res.render('about', {route: 'about'}))

app.listen(port, () => console.log(`on ${port}`))
