import express, { Router } from 'express'
import { listProduct } from './products'
import { create as transactionCreate } from './transactions'

class Urls {
  private router: Router
  constructor() {
    this.router = express.Router({mergeParams: true})
  }
  
  public expose() {
    this.router.get(
      '/products',
      listProduct,
    )

    this.router.post(
      '/transactions',
      transactionCreate,
    )
  
    return this.router
  }
}

export default new Urls().expose()