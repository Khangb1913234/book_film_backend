const express = require("express")
const films = require("../app/controllers/film.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/create", films.create)
    router.put("/update/:id", films.update)
    router.delete("/delete/:id", films.delete)
    router.delete("/action/:id", films.deleteMany)
    router.get("/:id", films.findOne)
    router.get("/", films.findAll)
    
    app.use("/film", router)
};