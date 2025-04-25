
const fs = require('fs');
const multer = require('multer');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = "./uploads"; 
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); 
      }
     
    } catch (error) {
      console.error(error);
    }
    cb(null, folderPath); 
  },
  filename: function (req, file, cb) {
    
    cb( null,file.originalname); 
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
