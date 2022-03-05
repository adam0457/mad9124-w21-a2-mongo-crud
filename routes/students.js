'use strict'

const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

router.get('/', async (req, res) => {
  const students = await Student.find()
  res.send({data: students.map(student => formatResponseData('students', student))})
})

router.post('/', async (req, res) => {})

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