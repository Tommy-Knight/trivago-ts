import createError from "create-error"
import jwt from "jsonwebtoken"
import UserModel from "../models/user/schema.js"

const secret = process.env.JWT_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET

export const JwtAuthenticateToken = async (req, res, next) => {
    if (!req.headers.authorization) next(createError(400, "Please provide a bearer token!"))

    try {
        const token = req.headers.authorization.replace("Bearer ", "")
        const payload = await verifyAccessToken(token)
        
        const user = await UserModel.findById(payload._id)
        
        if(user) {
            req.user = user
            next()
        } else {
            next(createError(404, "User not found!"))
        }

    } catch (error) {
        next(error)
    }
}

export const JwtAuthenticateUser = async (user) => {
    const accessToken = await generateAccessToken({ _id: user._id })
    const refreshToken = await generateRefreshToken({ _id: user._id })

    user.refreshToken = refreshToken
    await user.save()

    return { accessToken, refreshToken }
}

const generateAccessToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15 mins" }, (err, token) => (
            err ? reject(err) : resolve(token))
        )
    })
}

const generateRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 day" }, (err, token) => (
            err ? reject(err) : resolve(token)
        ))
    })
}

export const verifyAccessToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
            err ? reject(err) : resolve(token)
        })
    })
}

export const verifyRefreshToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, token) => {
            err ? reject(err) : resolve(token)
        })
    })
}

export const refreshTokens = async actualRefreshToken => {
    // 1. Is the actual refresh token not valid or expired?
  
    const content = await verifyRefreshToken(actualRefreshToken)
  
    // 2. If the token is valid we are going to find the user in db
  
    const user = await UserModel.findById(content._id)
  
    if (!user) throw new Error("User not found")
  
    // 3. Once we have the user we can compare actualRefreshToken with the refresh token saved in db
  
    if (user.refreshToken === actualRefreshToken) {
      // 4. If everything is fine we can generate the new tokens
      const newAccessToken = await generateJWT({ _id: user._id })
  
      const newRefreshToken = await generateRefreshJWT({ _id: user._id })
  
      // refresh token is saved in db
  
      user.refreshToken = newRefreshToken
  
      await user.save()
  
      return { newAccessToken, newRefreshToken }
    } else {
      throw new Error("Refresh Token not valid!")
    }
  }
