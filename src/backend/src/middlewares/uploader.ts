import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.memoryStorage()

const filter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true)
  } else {
    cb(new Error())
  }
}

const uploader = multer({
  storage,
  fileFilter: filter,
  limits: { fileSize: 1000 * 1000 * 10 },
})

export default uploader
