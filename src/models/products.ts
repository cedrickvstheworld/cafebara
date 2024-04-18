import {InferSchemaType, Schema, model} from "mongoose";
import { baseAttribs } from "./common";

export const product = {
  ...baseAttribs,
  productCode: { type: String, required: true },
  productName: { type: String, required: true },
  description: String,
  price: { type: Number, default: 0 },
}

const schema = new Schema({
  ...product,
  imageUrl: String,
})

export type Product = InferSchemaType<typeof schema>
export default model('products', schema)