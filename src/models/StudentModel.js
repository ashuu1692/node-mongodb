const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    enrollment: {
        type: String,
        required: true,
    },

    studentName: {
        type: String,
        required: true,
    },

    courseEnrolled: {
        type: Array,
        required: false,
    }
});

module.exports = StudentModel = mongoose.model("Student", studentSchema);