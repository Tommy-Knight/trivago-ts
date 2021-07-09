import mongoose from mongoose;

const { Schema, model } = mongoose;
const AccomodationSchema = new Schema({
    name: {
        type: string,
        required: true
    },
    description:{
            type: string,
            required: true
        },
    maxGuests: {
            type: number,
            required: true,
            minimum: 1
        },
    city: {
            type: string,
            required: true
        }
})

export default new model("Accomodation", AccomodationSchema)