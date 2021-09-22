const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseId: {
        type: String,
        required: true,
    },

    courseName: {
        type: String,
        required: true,
    },

    studentEnrolled: {
        type: Array,
        required: false,
    }

});

module.exports = CourseModel = mongoose.model("Course", courseSchema);