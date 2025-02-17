const express = require('express')
const router = express.Router()

const { List,
     Read, 
     Create, 
     Update, 
     Remove } = require('../Controllers/Product.js')

const { ProductsName,
      } = require('../Controllers/Product.js')   

const { ProductsType,
      } = require('../Controllers/Product.js')

const { ProductReadByName,
      } = require('../Controllers/Product.js')


//Middleware
const { Auth } = require('../Middleware/Auth.js')
const { ProductUpload } = require('../Middleware/ProductUpload.js')



//Add Product Administrator
router.post('/Product',ProductUpload,Create)
//Search All Product User - Administator
router.get('/Product',List)
//Search Product By Id User - Administator
router.get('/Product/:id',Read)
//Search Product By Name User - Administator
router.get('/ProductReadByName/:name',ProductReadByName)
//Update Product Administator
router.put('/Product/:id',ProductUpload,Update)
//Delete Product Administator
router.delete('/Product/:id',Remove)

//Search Product Name User
router.get('/Productsname/:name', ProductsName)
//Search Product Type User
router.post('/Productstype', ProductsType)


module.exports = router