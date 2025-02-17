const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    shopname:String,
    brand:{
        type:String
    },
    productname:{
        type:String
    },
    detail:{
        type:String
    },
    price:{
        type:Number
    },
    group:{
        type:String
    },
    type:{
        type:String
    },
    productqty:{
        type:Number
    },
    shippingcost:{
        type:Number
    },
    file1 :{
        type:String,
        default: 'no_image.jpg'
    },
    file2 :{
        type:String,
        default: 'no_image.jpg'
    },
    file3 :{
        type:String,
        default: 'no_image.jpg'
    },
    file4 :{
        type:String,
        default: 'no_image.jpg'
    },
    file5 :{
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

module.exports = mongoose.model('products,',productSchema)





/*const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')


const productSchema = mongoose.Schema({
    shopname:String,
    brand:{
        type: String
    },
    productname:{
        type: String
    },
    detail:{
        type: String
    },
    price:{
        type: Number
    },
    group:{
        type: String
    },
    type:{
        type: String
    },
    productqty:{
        type: Number
    },
    shippingcost:{
        type: Number
    },
    file :{
        type: String,
        default: 'No_image.jpg'
    },
    createdAt: { 
        type: Date, default: Date.now 
    },
    updatedAt: { 
        type: Date, default: Date.now 
    }
},{Timestamp: true})

module.exports = mongoose.model('products,',productSchema)*/