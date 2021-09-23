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
            let response = [];
            let allStudent = await StudentModel.find();
            // console.log(allStudent);
            for (let studentDetails of allStudent) {
                if (studentDetails) {
                    let responseObj = {};
                    let courseData = [];
                    for (let courseDetails of studentDetails.courseEnrolled) {
                        // console.log(courseDetails);
                        let allCourse = await CourseModel.findOne({ courseId: courseDetails }).select('-_id courseId courseName');
                        courseData.push(allCourse);
                        // console.log(courseData);
                    }
                    responseObj.enrollment = studentDetails.enrollment;
                    responseObj.studentName = studentDetails.studentName;
                    responseObj.courseEnrolled = courseData;
                    response.push(responseObj);
                }
            }
            return response;
        } catch (error) {
            console.log(`Could not fetch students ${error}`);
        }
    },

    fetchStudentWithId: async (enrollment) => {
        try {
            let studentResponseObj = {};
            let studentDetails = await StudentModel.findOne({ enrollment: enrollment });
            studentResponseObj.enrollment = studentDetails.enrollment;
            studentResponseObj.studentName = studentDetails.studentName;
            // console.log(studentResponseObj)

            if (studentDetails) {
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

    paginatedStudent: async (page, limit) => {
        try {
            let response = [];
            if (page > 0) {
                let startIndex = (page - 1) * limit;
                // let endIndex = page * limit;
                let resultedData = await StudentModel.find().limit(limit).skip(startIndex).select('-_id enrollment studentName courseEnrolled');
                for (let studentDetails of resultedData) {
                    if (studentDetails) {
                        let responseObj = {};
                        let courseData = [];
                        for (let courseDetails of studentDetails.courseEnrolled) {
                            // console.log(courseDetails);
                            let allCourse = await CourseModel.findOne({ courseId: courseDetails }).select('-_id courseId courseName');
                            courseData.push(allCourse);
                            // console.log(courseData);
                        }
                        responseObj.enrollment = studentDetails.enrollment;
                        responseObj.studentName = studentDetails.studentName;
                        responseObj.courseEnrolled = courseData;
                        response.push(responseObj)
                        // console.log(responseObj);
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