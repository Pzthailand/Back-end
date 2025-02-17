const { Timestamp } = require('mongodb')
const mongoose = require('mongoose')


const productOrderSchema = mongoose.Schema({
    userid:String,
    productid:{
        type:String
    },
    shopname:{
        type:String
    },
    productname:{
        type:String
    },
    price:{
        type:Number
    },
    orderqty:{
        type:Number
    },
    payment:{
        type:String
    },
    shippingcost:{
        type: Number
    },
    fname:{
        type:String
    },
    lname:{
        type:String
    },
    addres:{
        type:String
    },
    zipcode:{
        type:Number
    },
    phone:{
        type:String
    },
    productorderstatus:{
        type:String,
        default: 'Pending'
    },
    file1:{
        type:String
    },
    createdAt: { 
        type:Date, default: Date.now 
    },
    updatedAt: { 
        type:Date, default: Date.now 
    }
},{Timestamp: true})

module.exports = mongoose.model('productOrder,',productOrderSchema)