// src/business/services/studentService.js
const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    async getAllStudents(major = null, status = null) {
        // เรียก Repository
        const rows = await studentRepository.findAll(major, status);

        // คำนวณสถิติ
        const active = rows.filter(s => s.status === 'active').length;
        const graduated = rows.filter(s => s.status === 'graduated').length;
        const suspended = rows.filter(s => s.status === 'suspended').length;
        const avgGPA = rows.length > 0 
            ? (rows.reduce((sum, s) => sum + s.gpa, 0) / rows.length).toFixed(2)
            : 0;

        return {
            students: rows,
            statistics: { 
                active, 
                graduated, 
                suspended, 
                total: rows.length,
                averageGPA: parseFloat(avgGPA)
            }
        };
    }

    async getStudentById(id) {
        studentValidator.validateId(id);
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new Error('Student not found');
        }
        return student;
    }

    async createStudent(studentData) {
        studentValidator.validateStudentData(studentData);
        studentValidator.validateStudentCode(studentData.student_code);
        studentValidator.validateEmail(studentData.email);
        studentValidator.validateMajor(studentData.major);

        try {
            return await studentRepository.create(studentData);
        } catch (err) {
            // เช็ค Error ซ้ำ (Unique Constraint)
            if (err.message && err.message.includes('UNIQUE')) {
                throw new Error('Student code or email already exists');
            }
            throw err;
        }
    }

    async updateStudent(id, studentData) {
        studentValidator.validateId(id);
        
        // เช็คว่ามีนักเรียนคนนี้ไหม
        const existingStudent = await studentRepository.findById(id);
        if (!existingStudent) throw new Error('Student not found');

        // Validate ข้อมูลใหม่
        studentValidator.validateStudentData(studentData);
        studentValidator.validateStudentCode(studentData.student_code);
        studentValidator.validateEmail(studentData.email);
        studentValidator.validateMajor(studentData.major);

        try {
            return await studentRepository.update(id, studentData);
        } catch (err) {
            if (err.message && err.message.includes('UNIQUE')) {
                throw new Error('Student code or email already exists');
            }
            throw err;
        }
    }

    async updateGPA(id, gpa) {
        studentValidator.validateId(id);
        studentValidator.validateGPA(gpa);

        const existingStudent = await studentRepository.findById(id);
        if (!existingStudent) throw new Error('Student not found');

        return await studentRepository.updateGPA(id, gpa);
    }

    async updateStatus(id, status) {
        studentValidator.validateId(id);
        studentValidator.validateStatus(status);

        const existingStudent = await studentRepository.findById(id);
        if (!existingStudent) throw new Error('Student not found');

        // Business Rule: ห้ามเปลี่ยนสถานะคนลาออก (Withdrawn)
        if (existingStudent.status === 'withdrawn') {
            throw new Error('Cannot change status of withdrawn student');
        }

        return await studentRepository.updateStatus(id, status);
    }

    async deleteStudent(id) {
        studentValidator.validateId(id);

        const existingStudent = await studentRepository.findById(id);
        if (!existingStudent) throw new Error('Student not found');

        // Business Rule: ห้ามลบคนสถานะ Active
        if (existingStudent.status === 'active') {
            throw new Error('Cannot delete active student. Change status first.');
        }

        return await studentRepository.delete(id);
    }
}

module.exports = new StudentService();