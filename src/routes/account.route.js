const express = require("express")
const accounts = require("../app/controllers/account.controller")

module.exports = function(app){
    const router = express.Router()
    router.post("/signup", accounts.signUp)
    router.post("/signin", accounts.signIn)
    router.put("/update/:id", accounts.update)
    router.delete("/delete/:id", accounts.delete)
    router.delete("/action/:id", accounts.deleteMany)
    router.get("/:id", accounts.findOne)
    router.get("/", accounts.findAll)
    
    app.use("/account", router)
};