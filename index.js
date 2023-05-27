import _ from "./config/conf.js"
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js"
import profileRoute from "./routes/profileRoute.js"
import provinceRoute from "./routes/provinceRoute.js"
import landmarkRoute from "./routes/landmarkRoute.js"
import postRoute from "./routes/postRoute.js"
import commentProvinceRoute from "./routes/commentProvinceRoute.js"
import commentDetailRoute from "./routes/commentDetailRoute.js"
import commentPostRoute from "./routes/commentPostRoute.js"
import tripRoute from "./routes/tripRoute.js"
import bodyParser from 'body-parser';
import cors from 'cors'
import jwt from 'jsonwebtoken'
const app = express()

try {
  await mongoose.connect(process.env.DB_CONNECTION_STR, { useUnifiedTopology: true, useNewUrlParser: true })
  console.log("Database connected...")
} catch (e) {
  console.log("Error connected database")
  console.log(e)
  process.exit(-1)
}
app.use(morgan('dev'))
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use("/public", express.static("public"));
app.use(cors())

// app.use((req, res, next) => {
//   const token = req.headers['authorization'];
//   jwt.verify(token, 'etwda2023', function (err, decoded) {
//     if (!err) {
//       console.log(`Logged as ${decoded.email}`)
//       res.locals.auth = decoded
//       console.log(decoded)
//     }
//   });
//   next()
// })
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/auth', authRoute)
app.use('/profile', profileRoute)
app.use('/province', provinceRoute)
app.use('/landmark', landmarkRoute)
app.use('/post', postRoute)
app.use('/comment-province', commentProvinceRoute)
app.use('/comment-landmark', commentDetailRoute)
app.use('/comment-post', commentPostRoute)
app.use('/trip', tripRoute)

app.use((req, res) => {
  res.json({
    status: 404,
    message: "Not found",
    data: null
  })
})
app.listen(process.env.PORT, () => {
  console.log(`VieWander backend http://127.0.0.1:${process.env.PORT}`)
})
