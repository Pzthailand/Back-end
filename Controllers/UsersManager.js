const Users = require('../Models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs') //npm install fs-extra

/*exports.ListUsers = async (req, res) => {
    const { page = 1, pageSize = 10 } = req.query; // Get page and pageSize from query params
    const limit = parseInt(pageSize, 10);
    const pageNumber = parseInt(page, 10);

    // Input validation
    if (isNaN(pageNumber) || isNaN(limit) || pageNumber < 1 || limit < 1) {
        return res.status(400).json({ message: 'Invalid page or pageSize' });
    }

    const skip = (pageNumber - 1) * limit;

    try {
        const users = await Users.find()
            .skip(skip)
            .limit(limit);

        const total = await Users.countDocuments(); // Get total user count

        res.json({
            users,
            total,
            page: pageNumber,
            pageSize: limit,
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};*/

exports.ListUsers = async (req,res) => {
    try {
        //Code
        const user = await Users.find({}).select('-password').exec();
        res.send(user)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ReadUsers= async (req,res) => {
    try {
        //Code
        const id = req.params.id
        const user = await Users.findOne({_id : id}).select('-password').exec();
        res.send(user)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.UpdateUsers= async (req,res) => {
    try {
        const id = req.params.id
        var NewData = req.body
        
        console.log(NewData)

        if(typeof req.file !== 'undefined'){
            NewData.file = req.file.filename
            await fs.unlink('./UserImages/' + NewData.fileold,(err)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log('Remove old image success')
                }
            })
        }

        //updateAt
        NewData.updatedAt = new Date();

        const updated = await Users.findOneAndUpdate({_id: id},NewData,{new: true}).exec();
        /*res.send(updated)*/
        res.status(200).send('Update success')
        //const updated = await Product.findOneAndUpdate({_id: id},req.body,{new: true}).exec();
        //res.send(id)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ReadUsersByName= async (req,res) => {
    try {
        //Code
        const username = req.params.name
        const user = await Users.findOne({username : username}).select('-password').exec();
        res.send(user)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.UpdateUsersByName= async (req,res) => {
    try {
        const username = req.params.name
        var NewData = req.body
        
        console.log(NewData)

        if(typeof req.file !== 'undefined'){
            NewData.file = req.file.filename
            await fs.unlink('./UserImages/' + NewData.fileold,(err)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log('Remove old image success')
                }
            })
        }

        //updateAt
        NewData.updatedAt = new Date();

        const updated = await Users.findOneAndUpdate({username: username},NewData,{new: true}).exec();
        /*res.send(updated)*/
        res.status(200).send('Update success')
        //const updated = await Product.findOneAndUpdate({_id: id},req.body,{new: true}).exec();
        //res.send(id)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.RemoveUsers= async (req,res) => {
    try {
        const id = req.params.id
        const user = await Users.findOneAndDelete({_id:id});
        res.send('Delete Success')
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}


exports.ChangeStatus = async (req,res) => {
    try {
        console.log(req.body)
        const {id , enabled} = req.body
        const user = await Users.findOneAndUpdate({_id:id},{enabled:enabled});
        res.send(user)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}

exports.ChangeRole = async (req,res) => {
    try {
        console.log(req.body)
        const {id , role} = req.body
        const user = await Users.findOneAndUpdate({_id:id},{role:role});
        res.send(user)
    } catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }
}