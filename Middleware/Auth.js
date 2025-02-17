const jwt = require('jsonwebtoken')
const Users = require('../Models/Users')

exports.Auth = async (req, res, next) => {
    try{
       const token = req.headers["authtoken"]
       if(!token){
        return res.status(401).send('Unauthorization')
       }
       const decoded = jwt.verify(token,process.env.JWT_SECRET)
       req.user = decoded.user
       //console.log(decoded)
       next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token has expired');
        }
        return res.status(401).send('Invalid token');
        }
    }

exports.Admininistrator = async (req, res, next) => {
    try{
        const { username } = req.user
        AdminUser = await Users.findOne({ username }).exec()
        if(AdminUser.role !== 'admin'){
            res.status(403).send('Admin Access denied')
        }else{
            next();
        }
    } catch (err) {
        console.log(err)
        res.send('Admin Access denied').status(401)
        }
    }