import express, { Router } from 'express'
import {Request, Response} from 'express'
import Transaction from "../provider/transactions"

export const create = async (request: Request, response: Response) => {
  const {
    items,
    metadata,
    isPaid,
    transactionCode,
  } = request.body
  const Provider = new Transaction()
  try {
    const transaction = await Provider.create({
      items,
      metadata,
      isPaid,
      transactionCode,
    })
    return response.status(200).json({transaction})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

const list = async (request: Request, response: Response) => {
  const Provider = new Transaction()
  try {
    const transactions = await Provider.list()
    return response.status(200).json(transactions)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

const getOrder = async (request: Request, response: Response) => {
  const {transactionCode} = request.params
  const Provider = new Transaction()
  try {
    const transaction = await Provider.findOrder(transactionCode)
    return response.status(200).json(transaction)
  } catch(e) {
    return response.status(400).json({
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
      list,
    )
    this.router.get(
      '/:transactionCode',
      getOrder,
    )
    this.router.post(
      '/',
      create,
    )
    return this.router
  }
}

export default new Urls().expose()