import express from "express"
import cors from "cors"
import http from "http"
import path from "path"
import multer from "multer"
import { fileURLToPath } from "url"
import { nanoid } from "nanoid"

const app = express()
const server = new http.Server(app)
const routes = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const UPLOAD_FOLDER_PATH = path.resolve(__dirname, "uploads")
export const FILE_MAX_SIZE = 3_000_000_00 // 300 MB
export function generateUniqueId(idLength = 10) {
  return nanoid(idLength)
}
const multerConfig = {
  dest: UPLOAD_FOLDER_PATH,

  limits: {
    fileSize: FILE_MAX_SIZE,
  },

  storage: multer.diskStorage({
    destination: (_, __, createFileInFolder) => {
      createFileInFolder(null, UPLOAD_FOLDER_PATH)
    },

    filename: (_, file, appendFileName) => {
      const fileId = generateUniqueId()
      const fileName = file.originalname
      const customName = `${fileId}--${fileName}`

      appendFileName(null, customName)
    },
  }),
}

const multerMiddleware = multer(multerConfig).single("file")

export const FileController = {
  async store(request, response) {
    console.log(request.file)
    return response.status(200).json()
  },
}

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/file", express.static(UPLOAD_FOLDER_PATH))

app.get("/", (req, res) => {
  res.send("Hello")
})

app.post("/user/:id/files", multerMiddleware, FileController.store)

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
})
