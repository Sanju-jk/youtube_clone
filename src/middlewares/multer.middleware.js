import multer from "multer";

//storing file in user diskstorage, as file can be large and it cannot be stored in server
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
     }
)