const express = require('express');
const router = express.Router();
const studentController = require('../controller/StudentController');

router.route('/postStudent')
    .post(studentController.postStudent);

router.route('/getStudent')
    .get(studentController.getStudent);

router.route('/getStudent/:id')
    .get(studentController.getStudentWithId);

router.route('/updateStudent/:id')
    .patch(studentController.updateStudent);

router.route('/deleteStudent/:enrollment')
    .delete(studentController.deleteStudent);

router.route('/postStudentInCourse')
    .post(studentController.coursesEnrolledByStudent);

// router.route('/getStudentEnrolledIntoCourse/:id')
//     .get(studentController.getStudentEnrolledIntoCourse);

// router.route('/deleteStudentFromCourse/:courseId/:enrollment')
//     .delete(studentController.deleteStudentFromCourses);


module.exports = router;