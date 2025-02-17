//multiple file
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
]);
