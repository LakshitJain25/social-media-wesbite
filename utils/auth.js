import jwt from 'jsonwebtoken'

const signToken = (user) => {
    return jwt.sign({
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: '3d' })
}

const isAuth = async (req, res, next) => {
    const { authorization } = req.headers
    if (authorization) {
        const token = authorization.slice(7, authorization.length)
        const p = await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).send({ message: "Token is not valid" })
            }
            else {
                req.user = decode
                next()
            }
        })
    }
    else {
        return res.status(401).send({ message: "Token not supplied" })
    }
}

export { signToken,isAuth }