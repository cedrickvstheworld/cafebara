import Model from "../models/transactions";

interface ITransactionCreate {
  items: {
    product: {
      _id: string
      productName: string
      productCode: string
      description: string
      price: number
      createdAt: number
      updatedAt: number
    },
    quantity: number
  }[],
  metadata: {
    customerName: string
    customerAddress: string
    clientName: string
  }
}

export default class {
  public async create(data: ITransactionCreate) {
    const total = data.items.reduce((curr, acc) => {
      curr += acc.product.price * (acc.quantity)
      return curr
    }, 0)
    try {
      const modelCreate = new Model({
        ...data,
        total
      })
      return await modelCreate.save()
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  public async list() {
    return await Model.find().limit(500).sort({createdAt: -1})
  }
}
