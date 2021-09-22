const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');

module.exports = {
    addCourse: async (data) => {
        try {
            const newCourse = {
                courseId: data.courseId,
                courseName: data.courseName,
            }
            const response = await new CourseModel(newCourse).save();
            return response;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCourse: async () => {
        try {
            const allCourse = await CourseModel.find();
            return allCourse;
        } catch (error) {
            console.log(`Could not fetch courses ${error}`);
        }
    },

    fetchCourseWithId: async (id) => {
        try {
            const singleIdResponse = await CourseModel.findOne({ courseId: id });
            return singleIdResponse;
        } catch (error) {
            console.log(`Course not found. ${error}`);
        }
    },

    modifyCourse: async (id, data) => {
        try {
            const { courseId, courseName } = data;
            const updatedResponse = await new Promise((resolve, reject) => {
                CourseModel.findOneAndUpdate(
                    { courseId: id },
                    {
                        "courseId": courseId,
                        "courseName": courseName
                    },
                    { upsert: true, new: true },
                    (error, doc) => {
                        if (error) {
                            console.log(JSON.stringify(error));
                            return reject(error);
                        }
                        // console.log(doc);
                        resolve(doc);
                    }
                );
            })
            return updatedResponse;
        } catch (error) {
            console.log(`Could not update course ${error}`);
        }
    },

    removeCourse: async (id) => {
        try {
            const deletedResponse = await CourseModel.findOneAndDelete({ courseId: id });
            return deletedResponse;
        } catch (error) {
            console.log(`Could not delete course ${error}`);
        }
    },

    addCourseIntoStudent: async (data) => {
        try {
            let updatedCourseDetails;
            const { courseId, enrollment } = data;
            // console.log(data);
            // console.log(courseId, enrollment);

            let courseDetails = await CourseModel.findOne({ courseId: courseId });
            console.log(courseDetails);
            if (courseDetails) {
                if (courseDetails.studentEnrolled) {
                    let arr = courseDetails.studentEnrolled;
                    if (!arr.includes(enrollment)) {
                        arr.push(enrollment);
                    }
                    // console.log(arr);
                    updatedCourseDetails = await new Promise((resolve, reject) => {
                        CourseModel.findOneAndUpdate(
                            { courseId: courseId },
                            {
                                "studentEnrolled": arr
                            },
                            { upsert: true, new: true },
                            (error, doc) => {
                                if (error) {
                                    console.log(JSON.stringify(error));
                                    return reject(error);
                                }
                                resolve(doc);
                            }
                        )
                    })
                }
            }
            let studentDetails = await StudentModel.findOne({ enrollment: enrollment })
            // console.log(studentDetails);
            if (studentDetails) {
                if (studentDetails.courseEnrolled) {
                    let arr = studentDetails.courseEnrolled;
                    if (!arr.includes(courseId)) {
                        arr.push(courseId);
                    }
                    // console.log(arr);
                    await StudentModel.findOneAndUpdate(
                        { enrollment: enrollment },
                        {
                            "courseEnrolled": arr
                        },
                        { upsert: true }
                    );
                }
            }
            return updatedCourseDetails;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCourseEnrolledIntoStudent: async (id) => {
        try {
            const singleStudentResponse = await StudentModel.findOne({ enrollment: id });
            return singleStudentResponse;
        } catch (error) {
            console.log(`Data not found. ${error}`);
        }
    }
}