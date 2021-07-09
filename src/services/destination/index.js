import express from "express"
import DestinationModel from "../../models/destination/schema.js"
import AccomodationModel from "../../models/accomodation/schema.js"
import createError from "http-errors"


const destinationRouter = express.Router()


destinationRouter.post("/", async (req, res, next) => {
    try {
        const newDestination = new DestinationModel(req.body)
        const { _id } = await newDestination.save()

        _id ? res.status(201).send(_id) : next(createError(400, "Error posting destination"))
    } catch (error) {
        next(error)
    }
})

destinationRouter.get("/", async (req, res, next) => {
    try {
        const destinations = await DestinationModel.find({})

        destinations.length > 0 ? res.status(200).send(destinations) : next(createError(404, "No destinations available"))
    } catch (error) {
        next(error)
    }
})

destinationRouter.get("/:id", async (req, res, next) => {
    try {
        const accomodations = await AccomodationModel.find({ city: req.params.id }).populate("city")

        accomodations.length > 0 ? res.status(200).send(accomodations) : next(createError(404, "No cities"))
    } catch (error) {
        next(error)
    }
})
export default destinationRouter