import multer from "multer";

//storing file in server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    //   console.log(file);
      
    }
  })
  
  export const upload = multer(
    { 
        storage,
        limits: {
          fileSize: 5 * 1024 * 1024 // 5MB file size limit
      }
     }
)