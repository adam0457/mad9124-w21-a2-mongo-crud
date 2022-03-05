'use strict'

const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

router.get('/', async (req, res) => {
  const students = await Student.find()
  res.json({data: students.map(student => formatResponseData('students', student.toObject()))})
})

router.post('/', async (req, res) => {
  let attributes = req.body.data.attributes
  delete attributes._id // if it exists

  let newStudent = new Student(attributes)
  await newStudent.save()

  res.status(201).json({data: formatResponseData('students', newStudent.toObject())})
})

router.get('/:id', async (req, res) => {})

router.patch('/:id', async (req, res) => {})

router.put('/:id', async (req, res) => {})

router.delete('/:id', async (req, res) => {})

/**
 * Format the response data object according to JSON:API v1.0
 * @param {string} type The resource collection name, e.g. 'cars'
 * @param {Object} resource An instance object from that collection
 * @returns
 */
function formatResponseData(type, resource) {
  const {id, ...attributes} = resource
  return {type, id, attributes}
}

module.exports = router