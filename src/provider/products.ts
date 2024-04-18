import Model from "../models/products";

interface IProductCreate {
  productName: string
  productCode: string
  description: string
  imageUrl?: string
  price: number
}

export default class {
  public async create(data: IProductCreate) {
    try {
      const findExisting = await this.findByCode(data.productCode)
      if (findExisting) {
        throw new Error('Product code already in use')
      }
      const findExistingName = await this.findByName(data.productName)
      if (findExistingName) {
        throw new Error('Product Name already in use')
      }
      const modelCreate = new Model(data)
      return await modelCreate.save()
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  public async update(_id: string, data: IProductCreate) {
    try {
      const findExisting = await this.findByCode(data.productCode)
      if (findExisting && findExisting._id !== _id) {
        throw new Error('Product code already in use')
      }
      const findExistingName = await this.findByName(data.productName)
      if (findExistingName && findExistingName._id !== _id) {
        throw new Error('Product Name already in use')
      }
      return await Model.findOneAndUpdate(
        { _id },
        {
          ...data,
          updatedAt: Date.now(),
        },
        {new: true}
      )
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  public async delete(_id: string) {
    return await Model.findOneAndDelete({ _id })
  }
  public async findByCode(code: string) {
    return await Model.findOne({productCode: code})
  }
  public async findByName(code: string) {
    return await Model.findOne({productName: code})
  }
  public async list(keyword: string) {
    return await Model.find({
      productName: new RegExp(keyword, 'gi')
    }).sort({productName: 1})
  }
}
