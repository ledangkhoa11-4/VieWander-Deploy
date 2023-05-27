import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config();

const authMiddleware = async (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1]

        if (token) {
            const decoded = jwt.verify(token, "etwda2023")
            console.log(decoded?.id)
            req.body._id = decoded?.id
        }
        next()
    } catch (error) {
        console.log(error)
    }

}
export default authMiddleware