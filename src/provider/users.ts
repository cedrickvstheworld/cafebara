import { hash, test } from "../utils/bcrypt";
import Model from "../models/users";
import jwt from "../utils/jwt";
import { verify } from "crypto";

interface IUserCreate {
  username: string
  password: string
}

export default class {
  public async create({username, password}: IUserCreate) {
    try {
      const existing = await Model.findOne({username})
      if (existing) {
        throw new Error("username already exists")
      }
      const modelCreate = new Model({
        username,
        password: await hash(password)
      })
      return await modelCreate.save()
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async signIn({username, password}: IUserCreate) {
    try {
      const e = "incorrect username or password"
      const user = await Model.findOne({username})
      if (!user) {
        throw new Error(e)
      }
      const testPassword = await test(password, user.password)
      if (!testPassword) {
        throw new Error(e)
      }
      const r = {
        _id: user._id,
        username: user.username,
      }
      return {
        ...r,
        accessToken: new jwt().getAccessToken(r)
      }
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }

  public async authorize(accessToken: string) {
    try {
      const r = new jwt().verify(accessToken, `${process.env.JWT_SECRET_KEY_SESSION}`)
      if (!verify) {
        throw new Error("invalid access token")
      }
      return r
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  
}
