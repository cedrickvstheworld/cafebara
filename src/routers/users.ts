import express, { Router } from 'express'
import {Request, Response} from 'express'
import User from "../provider/users"

  
const create = async (request: Request, response: Response) => {
  const {
    username,
    password,
    apiKey,
  } = request.body
  if (apiKey !== process.env.API_BYPASS_KEY) {
    return response.status(403).json({
      message: "invalid apiKey"
    })
  }
  if (!username || !password) {
    return response.status(403).json({
      message: "incomplete fields"
    })
  }
  const Provider = new User()
  try {
    const user = await Provider.create({
      username,
      password,
    })
    return response.status(200).json({user})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

const signIn = async (request: Request, response: Response) => {
  const {
    username,
    password,
  } = request.body
  if (!username || !password) {
    return response.status(400).json({
      message: "username and password is required"
    })
  }
  const Provider = new User()
  try {
    const user = await Provider.signIn({
      username,
      password,
    })
    return response.status(200).json({user})
  } catch(e) {
    return response.status(401).json({
      message: (<Error>e).message
    })
  }
}

const authorize = async (request: Request, response: Response) => {
  const {
    access_token,
  } = request.headers
  const Provider = new User()
  try {
    const user = await Provider.authorize(`${access_token}`)
    return response.status(200).json(user)
  } catch(e) {
    return response.status(401).json({
      message: (<Error>e).message
    })
  }
}



class Urls {
  private router: Router
  constructor() {
    this.router = express.Router({mergeParams: true})
  }

  public expose() {
    this.router.get(
      '/',
      authorize,
    )

    this.router.post(
      '/',
      create,
    )

    this.router.post(
      '/sign-in',
      signIn,
    )
    return this.router
  }
}

export default new Urls().expose()