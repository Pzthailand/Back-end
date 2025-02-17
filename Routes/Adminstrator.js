const express = require('express')
const router = express.Router()

//Controller UsersManager
const {ListUsers, 
    ReadUsers, 
    UpdateUsers, 
    RemoveUsers, 
    ChangeStatus,
    ChangeRole, }  = require  ('../Controllers/UsersManager.js')

const { ReadUsersByName, 
        UpdateUsersByName,
    }  = require  ('../Controllers/UsersManager.js')    


//Middleware
const { Auth,Admininistrator } = require('../Middleware/Auth.js')
const { UserUpload } = require('../Middleware/UserUpload.js')

//Users Manager By Admininistrator
router.get('/ListUsers',Auth,Admininistrator,ListUsers)
//By Id
router.get('/ReadUsers/:id',Auth,Admininistrator,ReadUsers)
router.put('/UpdateUsers/:id',UserUpload,Auth,Admininistrator,UpdateUsers)
//By Username
router.get('/ReadUsersByName/:name',UserUpload,Auth,Admininistrator,ReadUsersByName)
router.put('/UpdateUsersByName/:name',UserUpload,Auth,Admininistrator,UpdateUsersByName)

router.delete('/RemoveUsers/:id',Auth,Admininistrator,RemoveUsers)
router.post('/ChangeStatus',Auth,Admininistrator, ChangeStatus)
router.post('/ChangeRole',Auth,Admininistrator, ChangeRole)

//By User
//router.get('/ListUsers',Auth,ListUsers)

module.exports = router