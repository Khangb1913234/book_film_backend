const express = require("express")
const tickets = require("../app/controllers/ticket.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", tickets.create)
    router.get("/statistic", tickets.statistic)
    router.get("/private", tickets.findAllPrivate)
    router.get("/:id", tickets.findOne)
    router.get("/", tickets.findAll)
    
    app.use("/ticket", router)
};