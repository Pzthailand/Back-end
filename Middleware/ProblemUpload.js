require('dotenv').config(); // npm install dotenv --save

const multer = require('multer'); // npm install multer --save
const cloudinary = require('cloudinary').v2; // npm install cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ใช้ CloudinaryStorage แทน multerStorageCloudinary // npm install multer-storage-cloudinary

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
    folder: 'ProblemImages', // ชื่อโฟลเดอร์ใน Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf'], // ฟอร์แมตไฟล์ที่อนุญาต
  },
});

// ใช้ Multer ในการตั้งค่าการอัพโหลดไฟล์
exports.ProblemUpload = multer({ storage: storage }).fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 },
]);


/*//multiple file
const multer = require('multer'); // npm install --save multer

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './ProblemImages');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Set up Multer
exports.ProblemUpload = multer({ storage: storage }).fields([
  { name: 'file1', maxCount: 1 },
  { name: 'file2', maxCount: 1 },
  { name: 'file3', maxCount: 1 },
  { name: 'file4', maxCount: 1 },
  { name: 'file5', maxCount: 1 },
]);*/
