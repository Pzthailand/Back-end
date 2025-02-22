require('dotenv').config(); // npm install dotenv --save

const multer = require('multer'); // npm install multer --save
const cloudinary = require('cloudinary').v2; // npm install cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ใช้ CloudinaryStorage แทน multerStorageCloudinary

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ตั้งค่า Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'UserImages', // ชื่อโฟลเดอร์ใน Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'], // ฟอร์แมตไฟล์ที่อนุญาต
  },
});

// ใช้ Multer ในการตั้งค่าการอัพโหลดไฟล์
exports.UserUpload = multer({ storage: storage }).single('file')



/*const multer = require('multer')// npm install --save multer

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
  
  exports.UserUpload = multer({ storage: storage }).single('file')*/
  //exports.Upload = multer().none() //Postman Check Value


