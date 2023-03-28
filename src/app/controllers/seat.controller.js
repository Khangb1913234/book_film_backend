const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const table = "seat"


exports.findAll = function(req, res, next){
    sql = `SELECT * FROM ${table} JOIN room ON seat.id_room = room.id_room ORDER BY room.number_room;`

    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({seats: result})
    })
    
}

exports.findOne = function(req, res, next){
    const seatId = req.params.id
    let sql = `SELECT * FROM ${table} WHERE id_seat = ?;`

    db.query(sql, [seatId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        res.json({seat: result})
    })
}

exports.findByRoom = function(req, res, next){
    const showtimeId = req.params.id
    let sql = `SELECT * FROM showtime WHERE id_showtime = ?;`

    db.query(sql, [showtimeId], (err, room)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        sql = `SELECT * FROM ${table} WHERE id_room = ? ORDER BY number_seat;`
        db.query(sql, [room[0].id_room], (err, result)=>{
            if (err) {
                console.error('Error executing query: ' + err.stack)
                return
            }
            res.json({seat: result})
        })
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

                const newSeat = {
                    number_seat: req.body.name,
                    status_seat: 0,
                    id_room: req.body.roomId
                }

                db.query(sql, newSeat, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json(err.sqlMessage)
                    }
                    res.json({msg: "Create seat"});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }
    else{res.json({msg: "Fail"})}
    
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
                const seatId = req.params.id
                const name = req.body.name
                const roomId = req.body.roomId
                const status = 0
                sql = `UPDATE ${table} SET number_seat = ?, status_seat = ?, id_room = ? WHERE id_seat = ?`;

                db.query(sql, [name, status, roomId, seatId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update seat with id = ${seatId}`});
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
                const seatId = req.params.id
                sql = `DELETE FROM ${table} WHERE id_seat = ?`

                db.query(sql, [seatId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete seat with id = ${seatId}`});
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
                const seatId = req.params.id.split("-")
                for(let i = 0; i < seatId.length; i++)
                    seatId[i] = Number(seatId[i])
                sql = `DELETE FROM ${table} WHERE id_seat IN (?)`

                db.query(sql, [seatId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete seat with id = ${seatId}`});
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
