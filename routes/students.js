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

router.get('/:id', async (req, res) => {
  console.log(req.params.id)
    try {
      const student = await Student.findById(req.params.id)//.populate('owner')
      if(!student){
          throw new Error('Resource not found')
      }
      res.json({data: formatResponseData('students', student.toObject())})
    }catch(err) {
      sendResourceNotFound(req, res)
    }
})

router.patch('/:id', async (req, res) => {
    try {
      const {_id, ...otherAttributes} = req.body.data.attributes
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        {_id: req.params.id, ...otherAttributes},
        {
          new: true,
          runValidators: true
        }
      )
      if (!student) throw new Error('Resource not found')
      res.json({data: formatResponseData('students', student.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
    }
})

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

function sendResourceNotFound(req, res){
  res.status(404).send({
    errors: [
      {
        status: '404',
        title: 'Resource does not exist',
        description: `We could not find a student with id: ${req.params.id}`
      }
    ]
  })
}

module.exports = router