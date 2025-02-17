const express = require('express')
const router = express.Router()

//Controller Auth
const { SignUp_By_Phone,
        SignUp_By_Email,
        SignUp,
        SignIn,
        CurrentUser,
        Profile,
        ProfileUpdate,
        ForgotPassword_By_Phone,
        ResetPassword_By_Phone,
        ForgotPassword_By_Email,
        ResetPassword_By_Email,
        VerifyEmailOTP,
        ChangeEmail,
        VerifyPhoneOTP,
        ChangePhone } = require  ('../Controllers/Auth')


//Middleware
const { Auth,Admininistrator } = require('../Middleware/Auth.js')
const { UserUpload } = require('../Middleware/UserUpload.js')


//Authenicator
router.post('/SignUpByPhone', SignUp_By_Phone)
router.post('/SignUpByEmail', SignUp_By_Email)
router.post('/SignUp', SignUp)
router.post('/SignIn', SignIn)
//Check CurrentUser
router.post('/CurrentUser',Auth,CurrentUser)

//Fogot Password By phone
router.post('/ForgotPasswordByPhone', ForgotPassword_By_Phone)
//Reset Password By phone
router.put('/ResetPasswordByPhone/:id',ResetPassword_By_Phone)

//Fogot Password By email
router.post('/ForgotPasswordByEmail', ForgotPassword_By_Email)
//Reset Password By email
router.put('/ResetPasswordByEmail/:id',ResetPassword_By_Email)

//Profile
router.get('/Profile/:id',Auth,Profile)
router.post('/ProfileUpdate/:id',Auth,UserUpload, ProfileUpdate)

//Account
router.post('/VerifyEmailOTP', VerifyEmailOTP)
router.put('/ChangeEmail/:id', ChangeEmail)

router.post('/VerifyPhoneOTP', VerifyPhoneOTP)
router.put('/ChangePhone/:id', ChangePhone)


//Admininistrator ProtectRoute
router.post('/CurrentAdmin',Auth,Admininistrator,CurrentUser)

module.exports = router