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
            const { courseId } = req.params;
            const courseData = await courseService.fetchCourseWithId(courseId);
            if (courseData) {
                res.json(courseData);
            } else {
                throw `Course with id: ${courseId} not found!`;
            }
        } catch (error) {
            res.status(404).json({ error: error });
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
            const { courseId } = req.params;
            const deletedCourseData = await courseService.removeCourse(courseId);
            if (deletedCourseData) {
                res.json(deletedCourseData);
            } else {
                throw `Course with id: ${id} not found!`;
            }
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },

    coursesEnrolledByStudent: async (req, res, next) => {
        try {
            const studentEnrolledIntoCourse = await courseService.addStudentIntoCourse(req.body);
            res.json(studentEnrolledIntoCourse);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },

    paginateCourse: async (req, res, next) => {
        try {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            console.log(page, limit);
            let paginatedCourse = await courseService.paginatedCourse(page, limit);
            if (paginatedCourse) {
                res.json(paginatedCourse);
            } else {
                throw "Data not found!"
            }
        } catch (error) {
            res.status(404).json({ error: error });
        }
    }

}