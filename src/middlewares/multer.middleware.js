
import multer from "multer"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  }, 
  
  filename: function (req, file, cb) {
    cb(null, file.originalname) 
  }
})


export const upload = multer({
    storage,
})


/*   Multer is a commonly used package for file uploading in the industry. 

// using disk storage
// cb = callback
// storage naam se method middleware

// filename can be unique see on multer documentation
// cb se return // filename mil jyega 
*/