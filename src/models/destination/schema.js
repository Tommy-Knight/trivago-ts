import mongoose from "mongoose";
import createError from "http-errors"


const { Schema, model } = mongoose;

const DestinationSchema = new Schema({
   name: {
       type: String,
       required: true,
       minLength: 3
   }
})

DestinationSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next(error)
    }
})

export default new model("Destination", DestinationSchema)