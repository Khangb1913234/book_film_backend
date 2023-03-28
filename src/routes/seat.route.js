const express = require("express")
const seats = require("../app/controllers/seat.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", seats.create)
    router.put("/update/:id", seats.update)
    router.delete("/delete/:id", seats.delete)
    router.delete("/action/:id", seats.deleteMany)
    router.get("/byshowtime/:id", seats.findByRoom)
    router.get("/:id", seats.findOne)
    router.get("/", seats.findAll)
    
    app.use("/seat", router)
};