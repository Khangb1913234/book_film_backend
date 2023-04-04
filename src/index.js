const express = require("express")
const app = express()
const PORT = 7000
const dotenv = require("dotenv")
dotenv.config()
const cors = require("cors")
const cron = require("node-cron")
const db = require("./config/db")


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

//----------------------------------------Tu dong reset ghe moi ngay---------------------------------------
cron.schedule('59 23 * * *', () => {
    let now = new Date()
    now = now.toISOString().slice(0, 10)
    let sql = `SELECT * FROM showtime WHERE date_showtime = ?;`

    db.query(sql, [now], (err, showtime)=>{
        if (err) {
            console.error('Reset ghe that bai1. Error1 executing query: ' + err.stack);
            return;
        }
        let a = []
        for(let i = 0; i < showtime.length; i++)
            a.push(showtime[i].id_showtime)
        a = a.join(',')
        sql = `DELETE FROM seat_showtime WHERE id_showtime IN (${a})`
        db.query(sql, (err, result)=>{
            if (err) {
                console.error('Reset ghe that bai. Error2 executing query: ' + err.stack);
                return;
            }
            console.log("Da reset ghe thanh cong")
        })
    })
});



app.use("/", (req, res) => {
    res.json({msg: "Main page"})
})



app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

