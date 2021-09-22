const express = require('express');
const router = express.Router();
const studentController = require('../controller/StudentController');

router.route('/postStudent')
    .post(studentController.postStudent);

router.route('/getStudent')
    .get(studentController.getStudent);

router.route('/getStudent/:enrollment')
    .get(studentController.getStudentWithId);

router.route('/updateStudent/:id')
    .patch(studentController.updateStudent);

router.route('/deleteStudent/:enrollment')
    .delete(studentController.deleteStudent);

router.route('/coursesEnrolledByStudent')
    .post(studentController.coursesEnrolledByStudent);



module.exports = router;