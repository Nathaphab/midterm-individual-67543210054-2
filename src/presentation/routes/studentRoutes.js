// src/presentation/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// กำหนด Routes ตามโจทย์
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.patch('/:id/gpa', studentController.updateGPA);
router.patch('/:id/status', studentController.updateStatus);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;