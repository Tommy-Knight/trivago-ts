import express from "express"
import AccomodationModel from "../../models/accomodation/schema.js"
import createError from "http-errors"


const accomodationRouter = express.Router()


accomodationRouter.get("/", async (req, res, next) => {
    try {
        const accomodations = await AccomodationModel.find({}).populate("city")

        accomodations.length > 0 ? res.status(200).send(accomodations) : res.status(404).send("No accomodations available")

    } catch (error) {
        console.log(error)
    }
})

accomodationRouter.post("/", async (req, res, next) => {
    try {
        const newAcc = new AccomodationModel(req.body)
        const response = await newAcc.save()

        response._id ? res.status(201).send(response) : next(createError(400, "Error creating accomodation"))

    } catch (error) {
        next(error)
    }
})

accomodationRouter.put("/:id", async (req, res, next) => {
    try {
        const updatedAccomodation = await AccomodationModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })

        updatedAccomodation ? res.status(200).send(updatedAccomodation) : res.status(404).send("Accomodation with Id not found")

    } catch (error) {
        console.log(error)
    }
})

accomodationRouter.get("/:id", async (req, res, next) => {
    try {
        const accomodation = await AccomodationModel.findById(req.params.id)

        accomodation ? res.status(200).send(accomodation) : res.status(404).send("Accomodation with Id not found")

    } catch (error) {
        console.log(error)
    }
})


accomodationRouter.delete("/:id", async (req, res, next) => {
    try {
        const deleted = await AccomodationModel.findByIdAndDelete(req.params.id)
        console.log(deleted)
        deleted ? res.status(204).send() : next(createError(404, "Id does not exist"))

    } catch (error) {
        next(error)
    }
})

export default accomodationRouter