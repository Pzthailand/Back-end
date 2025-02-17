const express = require('express')
const router = express.Router()


//User Controller
const { PaymentQR } = require('../Controllers/Payment.js')

//Middleware
const { Auth,Admininistrator } = require('../Middleware/Auth.js')

//User
router.post('/PaymentQR/:id', Auth , PaymentQR)


module.exports = router