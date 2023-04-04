const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const table = "showtime"
const moment = require("moment-timezone")


exports.findAll = function(req, res, next){
    sql = `SELECT * FROM ${table} join film on showtime.id_film = film.id_film join room on showtime.id_room = room.id_room;`

    db.query(sql, (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        for(let i = 0; i < result.length; i++){
            let temp = moment.tz(result[i].date_showtime, 'Asia/Ho_Chi_Minh')
            result[i].date_showtime = temp.format("YYYY-MM-DD")
        }
        res.json({showtimes: result})
    })
    
}

exports.findOne = function(req, res, next){
    const showtimeId = req.params.id
    const sql = `SELECT * FROM ${table} WHERE id_showtime = ?;`

    db.query(sql, [showtimeId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        let temp = moment.tz(result[0].date_showtime, 'Asia/Ho_Chi_Minh')
        result[0].date_showtime = temp.format("YYYY-MM-DD")
        res.json({showtime: result})
    })
}

exports.findFull = function(req, res, next){
    const showtimeId = req.params.id
    const sql = `SELECT * FROM ${table} JOIN film ON showtime.id_film = film.id_film JOIN room ON showtime.id_room = room.id_room WHERE id_showtime = ?;`

    db.query(sql, [showtimeId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        let temp = moment.tz(result[0].date_showtime, 'Asia/Ho_Chi_Minh')
        result[0].date_showtime = temp.format("YYYY-MM-DD")
        res.json({showtime: result})
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

                const newShowTime = {
                    date_showtime: req.body.date,
                    start_showtime: req.body.start,
                    end_showtime: req.body.end,
                    price_showtime: Number(req.body.price),
                    id_film: req.body.filmId,
                    id_room: req.body.roomId
                }

                db.query(sql, newShowTime, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json(err.sqlMessage)
                    }
                    res.json({msg: "Create showtime"});
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
                const showtimeId = req.params.id
                const date = req.body.date
                const start = req.body.start
                const end = req.body.end
                const price = Number(req.body.price)
                const filmId = req.body.filmId
                const roomId = req.body.roomId
                sql = `UPDATE ${table} SET date_showtime = ?, start_showtime = ?, end_showtime = ?, price_showtime = ?, id_film = ?, id_room = ? WHERE id_showtime = ?`;

                db.query(sql, [date, start, end, price, filmId, roomId, showtimeId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update showtime with id = ${showtimeId}`});
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
                const showtimeId = req.params.id
                sql = `DELETE FROM ${table} WHERE id_showtime = ?`

                db.query(sql, [showtimeId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete showtime with id = ${showtimeId}`});
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
                const showtimeId = req.params.id.split("-")
                for(let i = 0; i < showtimeId.length; i++)
                    showtimeId[i] = Number(showtimeId[i])
                sql = `DELETE FROM ${table} WHERE id_showtime IN (?)`

                db.query(sql, [showtimeId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete showtime with id = ${showtimeId}`});
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
