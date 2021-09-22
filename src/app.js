const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://openxcell:ECXMG8fLstpHX3Kj@cluster0.w9sph.mongodb.net/tutorial?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => console.log(`Connection successful`))
    .catch(err => console.log(`Error in DB connection ${err}`));


const studentRouter = require('./routes/StudentRoute');
app.use('/student', studentRouter);

const courseRouter = require('./routes/CourseRoute');
app.use('/course', courseRouter);


app.listen(PORT, () => {
    console.log(`Server is listening on port : ${PORT}`);
})