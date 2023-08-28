import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'
import { register } from './controllers/Auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import { verifyToken } from './middleware/auth.js'
import { createPost } from './controllers/posts.js'
import { users, posts } from './data/index.js'
import UserModel from './models/User.js'
import Post from './models/Posts.js'




/* CONFIGURATONS */
const __filename = fileURLToPath(import.meta.url)
const __dirname =  path.dirname(__filename);
dotenv.config()
const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb', extended: true}))
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))


/* STORAGE */
const storage = multer.diskStorage({
    destination: function (req,file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req,file,cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.post('/auth/register', upload.single('picture'), register)
app.post('/newpost', upload.single('picture'), verifyToken, createPost)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5001
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=> {
    app.listen(PORT, ()=> console.log(`Server is running on ${PORT}`))
    // UserModel.insertMany(users)
    // Post.insertMany(posts)
}).catch(error => console.log('ERROR::', error))