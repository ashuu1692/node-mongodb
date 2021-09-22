const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseController');

router.route('/postCourse')
    .post(courseController.postCourse);

router.route('/getCourse')
    .get(courseController.getCourse);

router.route('/getCourse/:courseId')
    .get(courseController.getCoursewithId);

router.route('/updateCourse/:id')
    .patch(courseController.updateCourse);

router.route('/deleteCourse/:courseId')
    .delete(courseController.deleteCourse);

router.route('/coursesEnrolledByStudent')
    .post(courseController.coursesEnrolledByStudent);




module.exports = router;