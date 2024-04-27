import Model from "../models/transactions";
import randomString from "randomstring"

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
    }
    quantity: number
  }[]
  metadata: {
    customerName: string
    customerAddress: string
    cashierName: string
  }
  isPaid: boolean
  transactionCode: string | null | undefined
}

export default class {
  public async create(data: ITransactionCreate) {
    const { transactionCode } = data
    if (transactionCode) {
      try {
        await this.findOrder(transactionCode)
        const updateExisting = await Model.findOneAndUpdate(
          {
            transactionCode,
            isPaid: false
          },
          {
            isPaid: true,
            "metadata.cashierName": data.metadata.cashierName
          },
          {new: true}
        )
        return updateExisting
      } catch (e) {
        throw new Error((<Error>e).message)
      }
    }
    const total = data.items.reduce((curr, acc) => {
      curr += acc.product.price * (acc.quantity)
      return curr
    }, 0)
    try {
      const modelCreate = new Model({
        ...data,
        transactionCode: randomString.generate(10).toLocaleLowerCase(),
        total,
      })
      return await modelCreate.save()
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
  public async list() {
    return await Model.find({isPaid: true}).limit(500).sort({createdAt: -1})
  }
  public async findOrder(transactionCode: string) {
    try {
      const order = await Model.findOne({
        transactionCode: transactionCode.toLocaleLowerCase(),
        isPaid: false,
      })
      if (!order) {
        throw new Error('Order does not exist or already has been settled')
      }
      return order
    } catch (e) {
      throw new Error((<Error>e).message)
    }
  }
}
