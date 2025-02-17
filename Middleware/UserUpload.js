const multer = require('multer')// npm install --save multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './UserImages') // Location Save file 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //Generate Date
      cb(null, uniqueSuffix + file.originalname) // Create Name File
      //cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  exports.UserUpload = multer({ storage: storage }).single('file')
  //exports.Upload = multer().none() //Postman Check Value


