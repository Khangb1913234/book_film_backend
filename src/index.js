const express = require("express")
const app = express()
const PORT = 7000
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")


const setupAccountRoutes = require("./routes/account.route")
const setupFilmRoutes = require("./routes/film.route")
const setupRoomRoutes = require("./routes/room.route")
const setupSeatRoutes = require("./routes/seat.route")
const setupShowtimeRoutes = require("./routes/showtime.route")
const setupTicketRoutes = require("./routes/ticket.route")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

setupAccountRoutes(app)
setupFilmRoutes(app)
setupRoomRoutes(app)
setupSeatRoutes(app)
setupShowtimeRoutes(app)
setupTicketRoutes(app)


app.use("/", (req, res) => {
    res.json({msg: "A"})
})



app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

