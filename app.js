
'use strict'

const morgan = require('morgan')
const express = require('express')
const app = express()
const sanitizeMongo = require('express-mongo-sanitize')
require('./startup/database')

app.use(morgan('tiny'))
app.use(express.json())
app.use(sanitizeMongo())
app.use('/api/students', require('./routes/students'))
app.use('/api/courses', require('./routes/courses'))

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`HTTP server listening on port ${port} ...`))