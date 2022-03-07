'use strict'

const express = require('express')
const router = express.Router()
const sanitizeBody = require('../middleware/sanitizeBody')
const Course = require('../models/Course')

router.get('/', async (req, res) => {
  const courses = await Course.find()
  res.json({data: courses.map(course => formatResponseData('courses', course.toObject()))})
})

router.post('/', sanitizeBody, async (req, res) => {
  try{

    let newCourse = new Course(req.sanitizedBody)
    await newCourse.save()
    res.status(201).json({data: formatResponseData('courses', newCourse.toObject())})

  }catch(err){
    sendNotAbleToPostError(res)

  }

})

router.get('/:id', async (req, res) => {

    try {
      const course = await Course.findById(req.params.id).populate('students')
      if(!course){
          throw new Error('Resource not found')
      }
      res.json({data: formatResponseData('courses', course.toObject())})
    }catch(err) {
      sendResourceNotFound(req, res)
    }
})

router.patch('/:id', sanitizeBody, async (req, res) => {
    try {
    
      const course = await Course.findByIdAndUpdate(
        req.params.id,      
        {...req.sanitizedBody},
        {
          new: true,
          runValidators: true
        }
      )
      if (!course) throw new Error('Resource not found')
      res.json({data: formatResponseData('courses', course.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
    }
})

router.put('/:id', sanitizeBody, async (req, res) => {
    try {
    
      const course = await Course.findByIdAndUpdate(
        req.params.id,       
        {...req.sanitizedBody},
        {
          new: true,
          overwrite: true,
          runValidators: true
        }
      )
      if (!course) throw new Error('Resource not found')
      res.json({data: formatResponseData('courses', course.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
    }
})

router.delete('/:id', async (req, res) => {
    try {
      const course = await Course.findByIdAndRemove(req.params.id)
      if (!course) throw new Error('Resource not found')
      res.json({data: formatResponseData('courses', course.toObject())})
    } catch (err) {
      sendResourceNotFound(req, res)
    }
})

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
        description: `We could not find a course with id: ${req.params.id}`
      }
    ]
  })
}

function sendNotAbleToPostError(res){
  res.status(400).send({
    errors: [
      {
        status: '400',
        title: 'Problem with the data',
        description: `We were not able to save your data`
      }
    ]
  })
}

module.exports = router