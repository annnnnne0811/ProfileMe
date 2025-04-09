const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    if (!req.session.user || !req.session.user.AccountID) {
      return cb(new Error('User not logged in or AccountID not found in session'));
    }
    const ext = path.extname(file.originalname);
    const name = `${req.session.user.AccountID}-${file.fieldname}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload;
