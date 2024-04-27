require("dotenv").config({ path: `${__dirname}/../.env` })

import express, { Response, Request, Application,  NextFunction} from "express"
import mongoose from "mongoose"
import morgan from 'morgan'
import UsersRouter from './routers/users'
import ProductsRouter from './routers/products'
import TransactionsRouter from './routers/transactions'
import PublicRouter from './routers/public'
import fileUpload from "express-fileupload"
import path from "path"
import jwt from "./utils/jwt"

class Main {
  private app: Application
  private port: string | number | any
  private dbUrlString: string | any

  constructor() {
    this.app = express()
    this.port = process.env.PORT
    this.dbUrlString = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
    this.appConfig()
  }

  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`*** Server is listening on port ${this.port}`)
    })
  }

  private connectToDatabase() {
    mongoose.connect(this.dbUrlString)
      .then((): void => {
        console.log(
          `*** Server is connected to database. Connection String: ${this.dbUrlString}`
        )
      })
      .catch((error: string): void => {
        console.log(
          `*** Server connection to the database failed. Connection String: ${this.dbUrlString}. Error: ${error}`
        )
      })
  }

  private loadRouters() {
    this.app.use('/users', UsersRouter)
    this.app.use('/public', PublicRouter)
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      const {access_token} = request.headers
      try {
        const r = new jwt().verify(`${access_token}`, `${process.env.JWT_SECRET_KEY_SESSION}`)
        if (!r) {
          response.status(401).json({message: "invalid access token"})
        }
        return next()
      } catch (e) {
        response.status(401).json({message: "invalid access token"})
      }
    })
    this.app.use('/products', ProductsRouter)
    this.app.use('/transactions', TransactionsRouter)
  }

  private appConfig() {
    this.app.use(morgan("dev"))
    this.app.use(fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }))
    // restrict headers contents and methods
    // allowed all for development
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.header("Access-Control-Allow-Origin", "*")
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Authorization, Content-Type, Accept, access_token"
      )
      response.setHeader("Access-Control-Allow-Credentials", "true")
      if (request.method === "OPTIONS") {
        response.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE"
        )
        return response.sendStatus(200)
      }
      next()
    })
    
    this.app.use(express.static(path.join(__dirname, '../public')));
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(express.json())

    this.connectToDatabase()
    this.loadRouters()
  }
}

const main = new Main()
main.listen()
