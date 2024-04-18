import {InferSchemaType, Schema, model} from "mongoose";
import { baseAttribs } from "./common";

export const user = {
  ...baseAttribs,
  username: { type: String, required: true },
  password: { type: String, required: true },
}

const schema = new Schema(user)

export type User = InferSchemaType<typeof schema>
export default model('users', schema)