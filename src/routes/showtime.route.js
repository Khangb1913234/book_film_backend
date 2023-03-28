const express = require("express")
const showtimes = require("../app/controllers/showtime.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", showtimes.create)
    router.put("/update/:id", showtimes.update)
    router.delete("/delete/:id", showtimes.delete)
    router.delete("/action/:id", showtimes.deleteMany)
    router.get("/full/:id", showtimes.findFull)
    router.get("/:id", showtimes.findOne)
    router.get("/", showtimes.findAll)
    
    app.use("/showtime", router)
};