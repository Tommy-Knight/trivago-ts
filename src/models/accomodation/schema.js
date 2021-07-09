import mongoose from "mongoose";

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
        type: String,
        required: true
    }
})

AccomodationSchema.post("validate", (error, doc, next) => {
    if (error) {
        console.log(error)
    } else {
        console.log("hello tommy")
    }
})

export default new model("Accomodation", AccomodationSchema)