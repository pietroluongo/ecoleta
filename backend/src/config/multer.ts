import multer from 'multer';
import path from 'path';
import crypto from 'crypto';


export default {
    storage: multer.diskStorage( {
        destination: path.resolve(__dirname, '..', '..', 'uploads'),
        filename(req, file, cb) {
            const hash = crypto.randomBytes(6).toString('hex');
            
            const fName = `${hash}-${file.originalname}`;

            cb(null, fName);
        }
    })
}