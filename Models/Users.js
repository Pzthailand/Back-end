const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')


const UsernameSchema = mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default : "user",
    },
    enabled: {
        type:Boolean,
        default: true,
    },
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    gender:{
        type:String
    },
    birthday:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:String
    },
    addres:{
        type:String
    },
    zipcode:{
        type:Number,
        default:0,
    },
    cart: [{
        shopname: {
            type:String
        },
        productid: {
            type:String
        },
        //Product in stock
        productqty: {
            type:Number,
        },
        //cart Product qty
        quantity: {
            type:Number,
            //default: 1  // Set a default quantity if needed
        },productname: {
            type:String
        },
        price: {
            type:Number,
        },
        shippingcost: {
            type:Number,
        },
        file1:{
            type:String,
        }
    }],
    file :{
        type:String,
        default: 'no_image.jpg'
    },
    problemstatus :{
        type:String,
        default:'None'
    },
    wallet :{
        type:Number,
        default:0
    },
    createdAt: { 
        type:Date, default: Date.now 
    },
    updatedAt: { 
        type:Date, default: Date.now 
    }
},{Timestamp: true})

module.exports = mongoose.model('Username,',UsernameSchema)