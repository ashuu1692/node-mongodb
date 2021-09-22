const express = require('express');
const router = express.Router();
const courseController = require('../controller/CourseController');

router.route('/postCourse')
    .post(courseController.postCourse);

router.route('/getCourse')
    .get(courseController.getCourse);

router.route('/getCourse/:id')
    .get(courseController.getCoursewithId);

router.route('/updateCourse/:id')
    .patch(courseController.updateCourse);

router.route('/deleteCourse/:id')
    .delete(courseController.deleteCourse);

router.route('/postCourseIntoStudent')
    .post(courseController.studentEnrolledByCourses);

router.route('/getCourseEnrolledIntoStudent/:id')
    .get(courseController.getCourseEnrolledIntoStudent);


module.exports = router;