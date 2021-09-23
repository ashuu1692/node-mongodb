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
            let response = [];
            const allCourse = await CourseModel.find();
            for (let courseDetails of allCourse) {
                if(courseDetails) {
                    let responseObj = {};
                    let studentData = [];
                    for (let studentDetails of courseDetails.studentEnrolled) {
                        let allStudent = await StudentModel.findOne({ enrollment: studentDetails}).select('-_id enrollment studentName');
                        studentData.push(allStudent)
                    }
                    responseObj.courseId = courseDetails.courseId;
                    responseObj.courseName = courseDetails.courseName;
                    responseObj.studentEnrolled = studentData;
                    response.push(responseObj);
                }
            }
            return response;
        } catch (error) {
            console.log(`Could not fetch courses ${error}`);
        }
    },

    fetchCourseWithId: async (courseId) => {
        try {
            // console.log(courseId)
            let courseResponseObj = {};
            let courseDetails = await CourseModel.findOne({ courseId: courseId });
            courseResponseObj.courseId = courseDetails.courseId;
            courseResponseObj.courseName = courseDetails.courseName;

            if (courseDetails) {
                let studentData = new Array();
                for (let value of courseDetails.studentEnrolled) {
                    let studentDetails = await StudentModel.findOne({ enrollment: value }).select('-_id enrollment studentName');
                    studentData.push(studentDetails);
                }
                courseResponseObj.studentEnrolled = studentData;
            }
            return courseResponseObj;
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

    removeCourse: async (courseId) => {
        try {
            let response = await CourseModel.findOne({ courseId: courseId });
            console.log(response.studentEnrolled);
            if (response) {
                for (let value of response.studentEnrolled) {
                    let studentDetails = await StudentModel.findOne({ enrollment: value });
                    console.log(studentDetails);
                    if (studentDetails) {
                        console.log(`-----${studentDetails.courseEnrolled}`)
                        if (studentDetails.courseEnrolled) {
                            let arr = studentDetails.courseEnrolled;
                            if (arr.includes(courseId)) {
                                console.log(courseId);
                                arr.remove(courseId);
                            }
                            console.log(arr);
                            await StudentModel.findOneAndUpdate(
                                { enrollment: value },
                                {
                                    "courseEnrolled": arr
                                },
                                { upsert: true }
                            );
                        }
                    }
                }
            }
            const deletedResponse = await CourseModel.findOneAndDelete({ courseId: courseId });
            return deletedResponse;
        } catch (error) {
            console.log(`Could not delete course ${error}`);
        }
    },

    addStudentIntoCourse: async (data) => {
        try {
            let updatedCourseDetails;
            const { courseId, enrollment } = data;
            // console.log(data);
            // console.log(courseId, enrollment);
            let courseDetails = await CourseModel.findOne({ courseId: courseId });
            // console.log(courseDetails);
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

    paginatedCourse: async (page, limit) => {
        try {
            let response = [];
            if (page > 0) {
                let startIndex = (page - 1) * limit;
                // let endIndex = page * limit;
                let resultedData = await CourseModel.find().limit(limit).skip(startIndex).select('-_id courseId courseName studentEnrolled');
                for (let courseDetails of resultedData) {
                    if(courseDetails) {
                        let responseObj = {};
                        let studentData = [];
                        for (let studentDetails of courseDetails.studentEnrolled) {
                            let allStudent = await StudentModel.findOne({ enrollment: studentDetails}).select('-_id enrollment studentName');
                            studentData.push(allStudent)
                        }
                        responseObj.courseId = courseDetails.courseId;
                        responseObj.courseName = courseDetails.courseName;
                        responseObj.studentEnrolled = studentData;
                        response.push(responseObj);
                    }
                }
                return response;
            } else {
                return "Enter proper page number."
            }
        } catch (error) {
            console.log(error);
        }
    },
}