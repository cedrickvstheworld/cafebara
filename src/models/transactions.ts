import {InferSchemaType, Schema, model} from "mongoose";
import { baseAttribs } from "./common";
import { product } from "./products";

const items = [{
  product,
  quantity: {type: Number, default: 0},
}]

const metadata = {
  customerName: String,
  customerAddress: String,
  cashierName: String,
}

const schema = new Schema({
  ...baseAttribs,
  items,
  metadata,
  total: Number,
  isPaid: Boolean,
  transactionCode: String,
})

export type Transaction = InferSchemaType<typeof schema>
export default model('transactions', schema)