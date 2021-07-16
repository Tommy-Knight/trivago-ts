export const checkIfAdmin = (req, res, next) => {
    if (req.user.role === "host") next()
    else next(createError(403))
}
