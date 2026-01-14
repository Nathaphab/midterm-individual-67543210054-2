// src/presentation/controllers/studentController.js
const studentService = require('../../business/services/studentService');

class StudentController {
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            const result = await studentService.getAllStudents(major, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getStudentById(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.getStudentById(id);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    async createStudent(req, res, next) {
        try {
            const student = await studentService.createStudent(req.body);
            res.status(201).json(student);
        } catch (error) {
            next(error);
        }
    }

    async updateStudent(req, res, next) {
        try {
            const { id } = req.params;
            const student = await studentService.updateStudent(id, req.body);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    async updateGPA(req, res, next) {
        try {
            const { id } = req.params;
            const { gpa } = req.body;
            const student = await studentService.updateGPA(id, gpa);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const student = await studentService.updateStatus(id, status);
            res.json(student);
        } catch (error) {
            next(error);
        }
    }

    async deleteStudent(req, res, next) {
        try {
            const { id } = req.params;
            const result = await studentService.deleteStudent(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();