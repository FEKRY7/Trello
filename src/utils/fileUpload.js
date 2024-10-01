const multer = require("multer");

const fileValidation = {
  image: ['image/jpeg', 'image/png', 'image/gif'],
  file: ['application/pdf', 'application/msword'],
  video: ['video/mp4'],
  imageVideosPdfWord: ['image/jpeg', 'image/png', 'image/gif','application/pdf', 'application/msword','video/mp4','audio/mp4' ],
};

function fileUpload(customValidation = []) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb("In-valid file format", false);
    }
  }
  const upload = multer({ fileFilter, storage });
  return upload;
}

module.exports = {
  fileValidation,
  fileUpload,
};