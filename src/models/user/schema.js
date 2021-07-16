import mongoose from "mongoose"
import bcrypt from "bcrypt"

const { model, Schema } = mongoose


const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["host", "user"] },
    accomodations: [{ type: Schema.Types.ObjectId, ref: "Accomodation"}]

})

UserSchema.post("validate", (error, doc, next) => {
    if (error) {
        const err = createError(400, error)
        next(err)
    } else {
        next(error)
    }
})
UserSchema.pre("save", async function (next) {
    const newUser = this

    const plainPw = newUser.password

    if (newUser.isModified("password")) {
        newUser.password = await bcrypt.hash(plainPw, 10)
    }
    next()
})

UserSchema.statics.checkCredentials = async function (email, plainPw) {

    const user = await this.findOne({ email })

    if (user) {

        const hashedPw = user.password

        const match = await bcrypt.compare(plainPw, hashedPw)

        if (match) return user

        else return null

    } else {
        return null
    }
}

UserSchema.methods.toJSON = function () {

    const user = this

    const useObject = user.toObject()

    delete useObject.password
    delete useObject.__v
    delete useObject.refreshToken
    delete useObject.email


    return useObject
}

export default new model("User", UserSchema)