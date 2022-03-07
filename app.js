
'use strict'

// const mongoose = require('mongoose')
// mongoose
//   .connect('mongodb://localhost:27017/assignment2', {
//     useNewUrlParser: true
//   })
//   .then(() => console.log('Connected to MongoDB ...'))
//   .catch(err => {
//     console.error('Problem connecting to MongoDB ...', err.message)
//     process.exit(1)
//   })

const morgan = require('morgan')
const express = require('express')
const app = express()
require('./startup/database')

app.use(morgan('tiny'))
app.use(express.json())
app.use('/api/students', require('./routes/students'))
app.use('/api/courses', require('./routes/courses'))

const port = process.env.PORT || 3030
app.listen(port, () => console.log(`HTTP server listening on port ${port} ...`))