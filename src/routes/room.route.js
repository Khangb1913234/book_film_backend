const express = require("express")
const rooms = require("../app/controllers/room.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", rooms.create)
    router.put("/update/:id", rooms.update)
    router.delete("/delete/:id", rooms.delete)
    router.delete("/action/:id", rooms.deleteMany)
    router.get("/:id", rooms.findOne)
    router.get("/", rooms.findAll)
    
    app.use("/room", router)
};