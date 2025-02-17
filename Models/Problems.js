const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')


const problemSchema = mongoose.Schema({
    problemsubject:String,
    username:{
        type:String
    },
    email:{
        type:String
    },
    problemdescription:{
        type:String
    },
    problemstatus:{
        type:String,
        default: 'Pending'
    },
    file1 :{
        type:String,
        default: 'no_image.jpg'
    },
    file2 :{
        type:String,
        default: 'no_image.jpg'
    },
    createdAt: { 
        type:Date, default: Date.now 
    },
    updatedAt: { 
        type:Date, default: Date.now 
    }
},{Timestamp: true})

module.exports = mongoose.model('problems,',problemSchema)