const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const table = "film"


exports.findAll = function(req, res, next){
    let sql
    if(!req.query.name)
        sql = `SELECT * FROM ${table};`
    else
        sql = `SELECT * FROM ${table} WHERE name_film LIKE '%${req.query.name}%'`

    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({films: result})
    })
    
}

exports.findOne = function(req, res, next){
    const filmId = req.params.id
    const sql = `SELECT * FROM ${table} WHERE id_film = ?;`

    db.query(sql, [filmId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({film: result})
    })
}

exports.create = function(req, res, next){
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if(err){
                console.error('Error executing query: ' + err.stack);
                res.json({msg: "Fail"})
                return;
            }
            if(account[0].role_acc = "admin"){
                sql = `INSERT INTO ${table} SET ?`

                const newFilm = {
                    name_film: req.body.name,
                    description_film: req.body.description,
                    length_film: req.body.length,
                    type_film: req.body.type,
                    image_film: req.body.image
                }

                db.query(sql, newFilm, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json(err.sqlMessage)
                    }
                    res.json({msg: "Create film"});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }
    else{
        res.json({msg: "Fail"})
    }
    
}

exports.update = function(req, res, next){
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if(err){
                console.error('Error executing query: ' + err.stack);
                res.json({msg: "Fail"})
                return;
            }
            if(account[0].role_acc = "admin"){
                const filmId = req.params.id
                const name = req.body.name
                const description = req.body.description
                const length = req.body.length
                const type = req.body.type
                const image = req.body.image
                sql = `UPDATE ${table} SET name_film = ?, description_film = ?, length_film = ?, type_film = ?, image_film = ? WHERE id_film = ?`;

                db.query(sql, [name, description, length, type, image, filmId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update film with id = ${filmId}`});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }
    else{
        res.json({msg: "Fail"})
    }
    
    
}

exports.delete = function(req, res, next){
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if(err){
                console.error('Error executing query: ' + err.stack);
                res.json({msg: "Fail"})
                return;
            }
            if(account[0].role_acc = "admin"){
                const filmId = req.params.id
                sql = `DELETE FROM ${table} WHERE id_film = ?`

                db.query(sql, [filmId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete film with id = ${filmId}`});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }
    else{
        res.json({msg: "Fail"})
    }
    
}

exports.deleteMany = function(req, res, next){
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if(err){
                console.error('Error executing query: ' + err.stack);
                res.json({msg: "Fail"})
                return;
            }
            if(account[0].role_acc = "admin"){
                const filmId = req.params.id.split("-")
                for(let i = 0; i < filmId.length; i++)
                    filmId[i] = Number(filmId[i])
                sql = `DELETE FROM ${table} WHERE id_film IN (?)`

                db.query(sql, [filmId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete film with id = ${filmId}`});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }
    else{
        res.json({msg: "Fail"})
    }
    
}
