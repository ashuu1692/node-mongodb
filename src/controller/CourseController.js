const courseService = require('../services/CourseService');

module.exports = {
    postCourse: async (req, res, next) => {
        try {
            const courseData = await courseService.addCourse(req.body);
            res.json(courseData)
        } catch (error) {
            res.status(500).json({ error: error });
        }

    },

    getCourse: async (req, res, next) => {
        try {
            const courseData = await courseService.fetchCourse();
            if (!courseData) {
                res.status(404).json("There are no courses!");
            }
            res.json(courseData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    getCoursewithId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const courseData = await courseService.fetchCourseWithId(id);
            res.json(courseData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    updateCourse: async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log(req.body)
            const data = {};
            data.courseId = req.body.courseId;
            data.courseName = req.body.courseName;
            console.log(data)
            const updatedCourseData = await courseService.modifyCourse(id, data);

            if (updatedCourseData.modifiedCount === 0) {
                throw new Error("Unable to update course, error occured.")
            }
            res.json(updatedCourseData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    deleteCourse: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedCourseData = await courseService.removeCourse(id);
            res.json(deletedCourseData);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    studentEnrolledByCourses: async (req, res, next) => {
        try {
            const studentEnrolled = await courseService.addCourseIntoStudent(req.body);
            res.json(studentEnrolled);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    getCourseEnrolledIntoStudent: async (req, res, next) => {
        try {
            const { id } = req.params;
            let studentDetails = await courseService.fetchCourseEnrolledIntoStudent(id);
            if (studentDetails) {
                res.json(studentDetails);
            } else {
                throw "Student Details not found!";
            }
        } catch (error) {
            res.status(404).json({ error: error })
        }
    }
}