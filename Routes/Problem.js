const express = require('express')
const router = express.Router()


//User Controller
const { ProblemReport } = require('../Controllers/Problem.js')
//Administrator Controller
const { ProblemList, ProblemRead,ProblemStatus,ProblemRemove,ProblemReply} = require('../Controllers/Problem.js')

//Middleware
const { Auth,Admininistrator } = require('../Middleware/Auth.js')
const { ProblemUpload } = require('../Middleware/ProblemUpload.js')

//User
router.post('/ProblemReport',ProblemUpload, ProblemReport)
//Administrator
router.get('/ProblemList', ProblemList)
router.get('/ProblemRead/:id', ProblemRead)
router.post('/ProblemStatus', ProblemStatus)//Update status by username
router.post('/ProblemRemove',ProblemRemove)//Remove and update username
router.post('/ProblemReply',ProblemReply)//Reply by nodemailer API


module.exports = router