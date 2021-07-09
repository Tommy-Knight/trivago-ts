import mongoose from "mongoose";
import createError from "http-errors"


const { Schema, model } = mongoose;

const AccomodationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true,
        minimum: 1
    },
    city: {
        type: Schema.Types.ObjectId, ref: "Destination",
        required: true
    }
})

AccomodationSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next(error)
    }
})

export default new model("Accomodation", AccomodationSchema)