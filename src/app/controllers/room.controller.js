const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const table = "room"


exports.findAll = function(req, res, next){
    sql = `SELECT * FROM ${table};`

    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({rooms: result})
    })
    
}

exports.findOne = function(req, res, next){
    const roomId = req.params.id
    const sql = `SELECT * FROM ${table} WHERE id_room = ?;`

    db.query(sql, [roomId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({room: result})
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

                const newRoom = {
                    number_room: req.body.name,
                    type_room: req.body.type
                }

                db.query(sql, newRoom, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json(err.sqlMessage)
                    }
                    res.json({msg: "Create room"});
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
                const roomId = req.params.id
                const name = req.body.name
                const type = req.body.type
                sql = `UPDATE ${table} SET number_room = ?, type_room = ? WHERE id_room = ?`;

                db.query(sql, [name, type, roomId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update room with id = ${roomId}`});
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
                const roomId = req.params.id
                sql = `DELETE FROM ${table} WHERE id_room = ?`

                db.query(sql, [roomId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete room with id = ${roomId}`});
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
                const roomId = req.params.id.split("-")
                for(let i = 0; i < roomId.length; i++)
                    roomId[i] = Number(roomId[i])
                sql = `DELETE FROM ${table} WHERE id_room IN (?)`

                db.query(sql, [roomId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete room with id = ${roomId}`});
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
