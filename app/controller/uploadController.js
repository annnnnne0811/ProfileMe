const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.session.user.AccountID}-${file.fieldname}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload;
