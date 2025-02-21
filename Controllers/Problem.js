const Problems = require('../Models/Problems')
const Users = require('../Models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises; // ใช้ fs.promises
require('dotenv').config() //npm install dotenv --save

//User
exports.ProblemReport = async (req, res) => {
    try {
        const data = req.body;
        
        // 1. Check if there is already a pending problem
        const ProblemPending = await Problems.findOne({ problemstatus: "Pending" });
        if (ProblemPending) {
            return res.status(400).send('There is already a pending problem report. Cannot upload another one.');
        }

        // Dynamically handle file uploads
        const uploadedFiles = ['file1', 'file2'];
        uploadedFiles.forEach(fileKey => {
            if (req.files[fileKey] && req.files[fileKey].length > 0) {
                data[fileKey] = req.files[fileKey][0].filename;
            }
        });

        // Convert email and username to lowercase
        const lowercaseEmail = data.email.toLowerCase();
        const lowercaseUsername = data.username ? data.username.toLowerCase() : '';

        const value = {
            problemsubject: data.problemsubject,
            username: data.username,
            email: lowercaseEmail,
            problemdescription: data.problemdescription,
            file1: data.file1,
            file2: data.file2
        };

        // Create a new problem report and save it to the database
        const newProblem = new Problems(value);
        await newProblem.save();
        res.status(201).send('Problem Report Created Successfully');

        // Update the user's problem status asynchronously
        if (lowercaseUsername) {
            await Users.findOneAndUpdate(
                { username: lowercaseUsername },
                { $set: { problemstatus: 'Pending' } },
                { new: true }
            );
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error: Could not process the request');
    }
};

/*exports.ProblemReport = async (req, res) => {
    try {
        console.log(req.body); // Log the body of the request
        console.log(req.files); // Log the uploaded files

        var data = req.body; // Access form data

        // Validate if problemsubject is provided
        if (!data.problemsubject) {
            return res.status(400).send('Please provide a problem subject');
        }

        // 1. ตรวจสอบสถานะของปัญหาที่มีสถานะเป็น 'Pending'
        const problemcheck = await Problems.findOne({ problemstatus: "Pending" });
        
        // ถ้ามีปัญหาที่มีสถานะเป็น 'Pending' อยู่แล้ว
        if (problemcheck) {
            return res.status(400).send('There is already a pending problem report. Cannot upload another one.');
        } else {
            // ตรวจสอบไฟล์ที่ถูกอัปโหลด
            if (req.files.file1 && req.files.file1.length > 0) {
                data.file1 = req.files.file1[0].filename; // Access the filename of the first file
            }
            
            if (req.files.file2 && req.files.file2.length > 0) {
                data.file2 = req.files.file2[0].filename; // Access the filename of the second file
            }
        
            if (req.files.file3 && req.files.file3.length > 0) {
                data.file3 = req.files.file3[0].filename; // Access the filename of the third file
            }
        
            if (req.files.file4 && req.files.file4.length > 0) {
                data.file4 = req.files.file4[0].filename; // Access the filename of the fourth file
            }
        
            if (req.files.file5 && req.files.file5.length > 0) {
                data.file5 = req.files.file5[0].filename; // Access the filename of the fifth file
            }
        
            // สร้างปัญหาใหม่และบันทึกข้อมูล
            const Problem = await Problems(data).save();
            res.send('Problem Report Success');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};*/

//Administrator
//All List Problem
exports.ProblemList = async (req,res) => {
    try{
        /*const producted = await Product.find({}).exec();*/ /* old to new */
        const problem = await Problems.find({}).sort({ _id: -1 }); /* new to old */
        res.send(problem)
    }catch (err) {
        console.log(err)
        res.status(500).send('Server Error')
    }
}

//View Problem
exports.ProblemRead = async (req,res) => {
    try{
        const id = req.params.id
        const problem = await Problems.findOne({_id: id}).exec();
        res.send(problem)
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}
//Update Status Problem
exports.ProblemStatus = async (req,res) => {
    try{
        //Medthod : None status = Finish
        const {username , problemstatus} = req.body;
        if(username){
            await Users.findOneAndUpdate(
                { username: username }, // search username
                { $set: { problemstatus: problemstatus } }, //No Problem Report
                { new: true }
            )
            await Problems.findOneAndUpdate(
                { username: username }, // search username
                { $set: { problemstatus: problemstatus } }, //No Problem Report
                { new: true }
            )
            res.status(200).send('Change Problem status Success')
        }
    } catch (err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ProblemRemove = async (req, res) => {
    try {

        const {id , username} = req.body;

        await Users.findOneAndUpdate(
            { username: username }, // search username
            { $set: { problemstatus: 'None' } }, //No Problem Report
            { new: true }
        )

        const removed = await Problems.findOneAndDelete({ _id: id }).exec();

        if (removed) {
            // Array of file fields to check
            const fileFields = ['file1', 'file2'];
    
            for (const field of fileFields) {
                if (removed[field] && removed[field] !== 'No_image.jpg') {
                    try {
                        // ใช้ fs.promises.unlink เพื่อใช้คำสั่ง async/await
                        await fs.unlink(`./ProblemImages/${removed[field]}`);
                        console.log(`Removed file: ${removed[field]}`);
                    } catch (err) {
                        console.log(`Error removing file ${removed[field]}:`, err);
                    }
                }
            }
            res.json({
                message: 'Problem removed successfully',
                Problems: removed,
            });
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

//Reply Problem
exports.ProblemReply = async (req, res) => {
    try {
        const { email, problemSubject, username, message } = req.body;
        console.log('Reply', email, problemSubject, username, message);

        const value = {
            email,
            problemSubject,
            username,
            message
        }
        if(value){
            return res.status(200).send('send message to backend success');
            //Logic API Mail
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
    }
};



