import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";


const storage = new CloudinaryStorage({
    cloudinary: cloudinaryUpload,
    params: {
        public_id: (req, file) => {
            const fileName = file.originalname
                .toLowerCase()
                .replace(/\s+/g, '-') //empty space remove
                .replace(/\./g, '-') //dot remove
                .replace(/[^a-z0-9.-]/g, '') //non alpha numeric remove
            const extension = file.originalname.split('.').pop(); //last element
            // binary -- 0,1 hexa -- 0-9 A-F base 36 -- 0-9 a-z
            // 0.1223645511 -- 0.3abcd554gf -- 3abcd554gf
            const uniqueFileName = Math.random().toString(36).substring(2) + '-' + Date.now() + '-' + fileName + '.' + extension
            return uniqueFileName;
        }
    }
})

export const multerUpload = multer({storage: storage})
