const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, path.join(__dirname, '../media/posts'));
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname  );
  }
})

const upload = multer({ storage: storage });

module.exports = upload;