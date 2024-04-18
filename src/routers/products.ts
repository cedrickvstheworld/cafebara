import express, { Router } from 'express'
import {Request, Response} from 'express'
import fs from 'fs'
import Product from "../provider/products"

const addProduct = async (request: Request, response: Response) => {
  const {
    productCode,
    name,
    description,
    price,
  } = request.body
  const img = request.files?.productImg
  if (!Array.isArray(img) && img) {
    const imgName = `${Date.now()}-${img.name}`
    const imgPath = `public/${imgName}`
    fs.writeFileSync(imgPath, img.data)
    const Provider = new Product()
    try {
      const product = await Provider.create({
        productName: name,
        productCode,
        description,
        imageUrl: imgName,
        price: parseFloat(price)
      })
      return response.status(200).json({product})
    } catch(e) {
      return response.status(400).json({
        message: (<Error>e).message
      })
    }
  }
  return response.status(200).json({msg: 'success'})
}

const update = async (request: Request, response: Response) => {
  const { id } = request.params
  const {
    productCode,
    name,
    description,
    price,
  } = request.body
  const img = request.files?.productImg
  let imgName
  if (!Array.isArray(img) && img) {
    imgName = `${Date.now()}-${img.name}`
    const imgPath = `public/${imgName}`
    fs.writeFileSync(imgPath, img.data)
  }
  const Provider = new Product()
  try {
    const product = await Provider.update(id, {
      productName: name,
      productCode,
      description,
      imageUrl: imgName,
      price: parseFloat(price)
    })
    return response.status(200).json({product})
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
  return response.status(200).json({msg: 'success'})
}

const listProduct = async (request: Request, response: Response) => {
  const keyword = request.query.keyword
  const Provider = new Product()
  try {
    const products = await Provider.list(<string>keyword)
    return response.status(200).json(products)
  } catch(e) {
    return response.status(400).json({
      message: (<Error>e).message
    })
  }
}

const deleteItem = async (request: Request, response: Response) => {
  const { id } = request.params
  const Provider = new Product()
  try {
    const product = await Provider.delete(id)
    return response.status(200).json(product)
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
      listProduct,
    )
    this.router.post(
      '/',
      addProduct,
    )
    this.router.delete(
      '/:id',
      deleteItem,
    )
    this.router.patch(
      '/:id',
      update,
    )
  
    return this.router
  }
}

export default new Urls().expose()