import mongoose from "mongoose"
import {v4 as uuidv4} from "uuid";

export const baseAttribs = {
  _id: {
    type: String,
    default: uuidv4
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: Number
}