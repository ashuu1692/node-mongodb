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
            res.json(studentData);
        } catch (error) {
            res.status(500).json({ error: error })
        }
    },

    getStudentWithId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const studentData = await studentService.fetchStudentWithId(id);
            if (studentData) {
                res.json(studentData);
            } else {
                throw `Student with id: ${id} not found!`;
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
            const courseEnrolled = await studentService.addStudentIntoCourse(req.body);
            res.json(courseEnrolled);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    // getStudentEnrolledIntoCourse: async (req, res, next) => {
    //     try {
    //         const { id } = req.params;
    //         let courseDetails = await studentService.fetchStudentEnrolledIntoCourse(id);
    //         if (courseDetails) {
    //             res.json(courseDetails);
    //         } else {
    //             throw "Course Details not found!";
    //         }
    //     } catch (error) {
    //         res.status(404).json({ error: error })
    //     }
    // },

    // deleteStudentFromCourses: async (req, res, next) => {
    //     try {
    //         // const { courseId, enrollment } = req.params;
    //         let deletedStudentFromCourse = await studentService.removeStudentFromCourse(req.params);
    //         res.json(deletedStudentFromCourse);
    //     } catch (error) {
    //         res.status(500).json({ error: error });
    //     }
    // }


}