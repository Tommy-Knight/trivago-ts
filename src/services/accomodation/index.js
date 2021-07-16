import express from "express"
import AccomodationModel from "../../models/accomodation/schema.js"
import createError from "http-errors"
import { JwtAuthenticateToken } from "../../auth/JWT.js"
import UserModel from "../../models/user/schema.js"

const accomodationRouter = express.Router()


accomodationRouter.get("/", async (req, res, next) => {
    try {
        const accomodations = await AccomodationModel.find({}).populate("city")

        accomodations.length > 0 ? res.status(200).send(accomodations) : res.status(404).send("No accomodations available")

    } catch (error) {
        console.log(error)
    }
})

accomodationRouter.post("/", JwtAuthenticateToken, async (req, res, next) => {
    try {

        const newAcc = new AccomodationModel({ ...req.body, host: req.user._id })
        const response = await newAcc.save()

        if (response) {
            await UserModel.findByIdAndUpdate(req.user._id, { $push: { accomodations: response._id } })
        }

        response._id ? res.status(201).send(response) : next(createError(400, "Error creating accomodation"))

    } catch (error) {
        next(error)
    }
})

accomodationRouter.put("/:id", JwtAuthenticateToken, async (req, res, next) => {
    try {
        const acc = await AccomodationModel.findById(req.params.id)

        if (req.user._id.toString() === acc.host.toString()) {

            const updatedAccomodation = await AccomodationModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true })
            console.log(updatedAccomodation)
            updatedAccomodation ? res.status(200).send(updatedAccomodation) : res.status(404).send("Accomodation with Id not found")
        } else {
            next(createError(404, "Accomodation not found!"))
        }

    } catch (error) {
        next(error)
    }
})

accomodationRouter.get("/:id", async (req, res, next) => {
    try {

        const acc = await AccomodationModel.findById(req.params.id)

        if (req.user._id.toString() === acc.host.toString()) {
            const accomodation = await AccomodationModel.findById(req.params.id).populate("host").populate("city")

            accomodation ? res.status(200).send(accomodation) : res.status(404).send("Accomodation with Id not found")
        } else {
            next(createError(404, "Accomodation not found!"))
        }

    } catch (error) {
        next(error)
    }
})


accomodationRouter.delete("/:id", async (req, res, next) => {
    try {
        if (req.user._id.toString() === acc.host.toString()) {
        const deleted = await AccomodationModel.findByIdAndDelete(req.params.id)
        console.log(deleted)
        deleted ? res.status(204).send() : next(createError(404, "Id does not exist"))
        } else {
            next(createError(404, "Accomodation not found!"))
        }
    } catch (error) {
        next(error)
    }
})

export default accomodationRouter