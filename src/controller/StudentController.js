const studentService = require('../services/StudentService');

module.exports = {
    postStudent: async (req, res, next) => {
        try {
            const studentData = await studentService.addStudent(req.body);
            res.json(studentData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    getStudent: async (req, res, next) => {
        try {
            const studentData = await studentService.fetchStudent();
            if (!studentData) {
                res.status(404).json("There are no students registered yet!");
            }
            delete studentData._id;
            res.json(studentData);
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    getStudentWithId: async (req, res, next) => {
        try {
            const { enrollment } = req.params;
            const studentData = await studentService.fetchStudentWithId(enrollment);
            if (studentData) {
                res.json(studentData);
            } else {
                throw `Student with id: ${enrollment} not found!`;
            }
        } catch (error) {
            res.status(404).json({ error: error })
        }
    },

    updateStudent: async (req, res, next) => {
        try {
            const { id } = req.params;
            // console.log(id);
            // console.log(req.body);
            const data = {};
            data.enrollment = req.body.enrollment;
            data.studentName = req.body.studentName;
            // console.log(data);
            const updatedStudentData = await studentService.modifyStudent(id, data);

            if (updatedStudentData.modifiedCount === 0) {
                throw new Error("Unable to update student, error occured.")
            }
            res.json(updatedStudentData);
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    deleteStudent: async (req, res, next) => {
        try {
            const { enrollment } = req.params;
            const deletedStudentData = await studentService.removeStudent(enrollment);
            res.json(deletedStudentData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    coursesEnrolledByStudent: async (req, res, next) => {
        try {
            // console.log(req.body.enrollment);
            const courseEnrolledByStudent = await studentService.addCourseIntoStudent(req.body);
            res.json(courseEnrolledByStudent);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },


}