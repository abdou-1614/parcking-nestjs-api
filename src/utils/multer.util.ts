import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import { diskStorage } from "multer"
import { extname } from "path"

export const validateImageType = /jpg|jpeg|png/

export const maxImageUpload = 3 * 1024 * 1024

export const MulterConfig: MulterOptions = {
    storage: diskStorage({
        destination: './tmp',
        filename(_, file, callback) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
            const filename = `${uniqueSuffix}.${file.originalname}`
            return callback(null, filename)
        },
    }),
    fileFilter(_, file, callback) {
        const mimeType = validateImageType.test(file.mimetype)
        const exttname = validateImageType.test(
            extname(file.originalname).toLowerCase()
        )

        if(mimeType && exttname) return callback(null, true)

        return callback(new Error('Invalid File Type'), false)
    },
    limits: {
        fileSize: maxImageUpload
    }
}