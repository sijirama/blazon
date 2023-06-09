import Express from "express"
import path from "path"
import dotenv from "dotenv"
import mongoose from "mongoose"
import morgan from "morgan"
import passport from "passport"
import session from "express-session"
import MongoStore from "connect-mongo"
import methodOverride from "method-override"
import { engine } from 'express-handlebars';
import { GoogleAuth } from "./config/passport"
dotenv.config()
GoogleAuth()


//NOTE: Helpers
import {
    formatDate,
    truncate,
    stripTags,
    editIcon,
    selectTag,
} from "./helpers/hbs"

//NOTE: import routes
import {router as IndexRouter} from "./routes/index"
import {router as AuthRouter} from "./routes/auth"
import {router as StoryRouter} from "./routes/story"

//HACK: define constants
const PORT = process.env.PORT || 3000
const staticFiles = path.join(__dirname,"public")
const expressSessionSecret = process.env.EXPRESS_SESSION_SECRET

//NOTE: import utilities
import {connectDB} from "./config/dbConnect"
connectDB()

const app = Express()

//NOTE: middleware
app.use(morgan('dev'))
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: String(expressSessionSecret) ,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl:process.env.MONGO_URI
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(Express.urlencoded({extended:false}))
app.use(Express.json())

//NOTE: Method overriding
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  }
}))

//NOTE: gloval var
app.use((req ,res , next) => {
    res.locals.user = req.user || null
    next()
})


//NOTE: View engine / handlebars
app.engine('.hbs', engine({defaultLayout:"main" ,helpers :{
    formatDate,
    truncate,
    stripTags,
    editIcon,
    selectTag,
} ,extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './src/views');

//NOTE: static
app.use(Express.static(staticFiles))

//NOTE: routes 
app.use("/" , IndexRouter)
app.use("/auth" , AuthRouter)
app.use("/stories", StoryRouter)



mongoose.connection.once("open" , () => {
    app.listen(PORT , () => {
        console.clear()
        //console.log(expressSessionSecret)
        console.log("Connected to database")
        console.log(`Server is listening at port ${PORT}`)
    })
})
