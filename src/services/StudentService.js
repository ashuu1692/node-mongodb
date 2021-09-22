const StudentModel = require('../models/StudentModel');
const CourseModel = require('../models/CourseModel');

module.exports = {
    addStudent: async (data) => {
        try {
            const newStudent = {
                enrollment: data.enrollment,
                studentName: data.studentName
            }
            const response = await new StudentModel(newStudent).save();
            return response;
        } catch (error) {
            console.log(error);
        }
    },

    fetchStudent: async () => {
        try {
            const allStudent = await StudentModel.find().select('-_id enrollment studentname courseEnrolled');
            return allStudent;
        } catch (error) {
            console.log(`Could not fetch students ${error}`);
        }
    },

    fetchStudentWithId: async (enrollment) => {
        try {
            let studentResponseObj = { };

            let studentDetails = await StudentModel.findOne({ enrollment: enrollment });
            studentResponseObj.enrollment = studentDetails.enrollment;
            studentResponseObj.studentName = studentDetails.studentName;
            // console.log(studentResponseObj)

            if(studentDetails) {
                let courseData = new Array();
                for (let value of studentDetails.courseEnrolled) {
                    let courseDetails = await CourseModel.findOne({ courseId: value }).select('-_id courseId courseName');
                    courseData.push(courseDetails);

                }
                // console.log(courseData)
                studentResponseObj.courseEnrolled = courseData;
            }
            return studentResponseObj;
        } catch (error) {
            console.log(`Student not found. ${error}`);
        }
    },

    modifyStudent: async (id, data) => {
        try {
            const { enrollment, studentName } = data
            const updatedResponse = await new Promise((resolve, reject) => {
                StudentModel.findOneAndUpdate(
                    { enrollment: id },
                    {
                        "enrollment": enrollment,
                        "studentName": studentName
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
            console.log(`Could not update student ${error}`);
        }
    },

    removeStudent: async (enrollment) => {
        try {
            let response = await StudentModel.findOne({ enrollment: enrollment })
            console.log(response.courseEnrolled);
            if (response) {
                for (let value of response.courseEnrolled) {
                    let courseDetails = await CourseModel.findOne({ courseId: value });
                    console.log(courseDetails);
                    if (courseDetails) {
                        console.log(`-----${courseDetails.studentEnrolled}`);
                        if (courseDetails.studentEnrolled) {
                            let arr = courseDetails.studentEnrolled;
                            if (arr.includes(enrollment)) {
                                console.log(enrollment);
                                arr.remove(enrollment);
                            }
                            console.log(arr);
                            await CourseModel.findOneAndUpdate(
                                { courseId: value },
                                {
                                    "studentEnrolled": arr
                                },
                                { upsert: true }
                            );
                        }
                    }
                }
            }
            const deletedResponse = await StudentModel.findOneAndDelete({ enrollment: enrollment });
            return deletedResponse;
        } catch (error) {
            console.log(`Could not delete student ${error}`);
        }
    },

    addCourseIntoStudent: async (data) => {
        try {
            let updatedStudentDetails;
            const { enrollment, courseId } = data;
            // console.log(data);
            // console.log(enrollment, courseId);
            let studentDetails = await StudentModel.findOne({ enrollment: enrollment })
            // console.log(studentDetails);
            if (studentDetails) {
                if (studentDetails.courseEnrolled) {
                    let arr = studentDetails.courseEnrolled;
                    if (!arr.includes(courseId)) {
                        arr.push(courseId);
                    }
                    // console.log(arr);
                    updatedStudentDetails = await new Promise((resolve, reject) => {
                        StudentModel.findOneAndUpdate(
                            { enrollment: enrollment },
                            {
                                "courseEnrolled": arr
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
            let courseDetails = await CourseModel.findOne({ courseId: courseId });
            console.log(courseDetails);
            if (courseDetails) {
                if (courseDetails.studentEnrolled) {
                    let arr = courseDetails.studentEnrolled;
                    if (!arr.includes(enrollment)) {
                        arr.push(enrollment);
                    }
                    // console.log(arr);
                    await CourseModel.findOneAndUpdate(
                            { courseId: courseId },
                            {
                                "studentEnrolled": arr
                            },
                            { upsert: true }
                        )
                }
            }
            return updatedStudentDetails;
        } catch (error) {
            console.log(error);
        }
    },

}