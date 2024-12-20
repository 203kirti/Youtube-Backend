import multer from "multer"; 

// using disk storage
// cb = callback
// storage naam se method middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  }, 
  // filename can be unique
  filename: function (req, file, cb) {
    cb(null, file.originalname) // filename mil jyega 
  }
})


export const upload = multer({
    storage,
})