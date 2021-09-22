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
            const allStudent = await StudentModel.find();
            return allStudent;
        } catch (error) {
            console.log(`Could not fetch students ${error}`);
        }
    },

    fetchStudentWithId: async (id) => {
        try {
            const singleIdResponse = await StudentModel.findOne({ enrollment: id });
            return singleIdResponse;
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
            // const deletedResponse = await StudentModel.findOneAndDelete({ enrollment: id });
            // return deletedResponse;
        } catch (error) {
            console.log(`Could not delete student ${error}`);
        }
    },

    addStudentIntoCourse: async (data) => {
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

    // fetchStudentEnrolledIntoCourse: async (id) => {
    //     try {
    //         const singleCourseResponse = await CourseModel.findOne({ courseId: id });
    //         return singleCourseResponse;
    //     } catch (error) {
    //         console.log(`Data not found. ${error}`);
    //     }
    // },

    // removeStudentFromCourse: async (params) => {
    //     try {
    //         const { courseId, enrollment } = params;
    //         // console.log(params);
    //         // console.log(courseId, enrollment);
    //         let courseDetails = await CourseModel.findOne({ courseId: courseId });
    //         console.log(courseDetails);
    //         if (courseDetails) {
    //             if (courseDetails.studentEnrolled) {
    //                 let arr = courseDetails.studentEnrolled;
    //                 if (arr.includes(enrollment)) {

    //                     arr.remove(enrollment)
    //                 }
    //                 console.log(arr);
    //                 let updatedCourseDetails = await new Promise((resolve, reject) => {
    //                     CourseModel.findOneAndUpdate(
    //                         { courseId: courseId },
    //                         {
    //                             "studentEnrolled": arr
    //                         },
    //                         { upsert: true, new: true },
    //                         (error, doc) => {
    //                             if (error) {
    //                                 console.log(JSON.stringify(error));
    //                                 return reject(error);
    //                             }
    //                             resolve(doc);
    //                         }
    //                     )
    //                 })
    //                 return updatedCourseDetails;
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}