const mongoose = require('mongoose')

/*const connectDB = async() => {
    try{
        await mongoose.connect('mongodb://127.0.0.1/Pzthailand')
        console.log('connect')
    } catch (err){
        console.log(err)
    }
}

module.exports = connectDB*/


const connectDB = async() => {
    try{
        await mongoose.connect('mongodb+srv://pzthailand:jXnOuyvPB3bYaESv@cluster0.kbqly.mongodb.net/')
        console.log('connect')
    } catch (err){
        console.log(err)
    }
}

module.exports = connectDB