const express = require('express')
const router = express.Router()

const { Addtocart , 
        UserAddtocartList, 
        UpdateCart,
        RemoveCart } = require('../Controllers/Addtocart')
    

//User
//1 add product
router.post('/Addtocart',Addtocart)
//2 list product 
router.post('/UserAddtocartList',UserAddtocartList)
//3 update product
router.put('/AddtocartUpdate',UpdateCart)
//4 delete product
router.post('/AddtocartRemove',RemoveCart)


module.exports = router