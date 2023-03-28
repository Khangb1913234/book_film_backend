const db = require("../../config/db")
const jwt = require("jsonwebtoken")
const table = "ticket"
const moment = require("moment-timezone")


exports.findAll = function(req, res, next){
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
                sql = `SELECT * FROM ${table} JOIN showtime ON ticket.id_showtime = showtime.id_showtime JOIN film ON showtime.id_film = film.id_film 
                    JOIN room ON showtime.id_room = room.id_room JOIN seat ON ticket.id_seat = seat.id_seat JOIN acc ON ticket.id_acc = acc.id_acc;`

                db.query(sql, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json({msg: "Fail"})
                        return
                    }
                    for(let i = 0; i < result.length; i++){
                        let temp1 = moment.tz(result[i].date_ticket, 'Asia/Ho_Chi_Minh')
                        let temp2 = moment.tz(result[i].date_showtime, 'Asia/Ho_Chi_Minh')
                        result[i].date_ticket = temp1.format("DD-MM-YYYY")
                        result[i].date_showtime = temp2.format("DD-MM-YYYY")
                        result[i].start_showtime = result[i].start_showtime.slice(0, 5)
                    }
                    res.json({tickets: result})
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

exports.findAllPrivate = function(req, res, next){
    var token = req.header("Authorization") 
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if (err) {
                console.error('Error executing query: ' + err.stack)
                return
            }
            else{
                sql = `SELECT * FROM ${table} JOIN showtime ON ticket.id_showtime = showtime.id_showtime JOIN film ON showtime.id_film = film.id_film 
                JOIN room ON showtime.id_room = room.id_room JOIN seat ON ticket.id_seat = seat.id_seat WHERE id_acc = ?;`
                db.query(sql, [account[0].id_acc], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        return
                    }
                    else{
                        for(let i = 0; i < result.length; i++){
                            let temp1 = moment.tz(result[i].date_ticket, 'Asia/Ho_Chi_Minh')
                            let temp2 = moment.tz(result[i].date_showtime, 'Asia/Ho_Chi_Minh')
                            result[i].date_ticket = temp1.format("DD-MM-YYYY")
                            result[i].date_showtime = temp2.format("DD-MM-YYYY")
                            result[i].start_showtime = result[i].start_showtime.slice(0, 5)
                        }
                        res.json({tickets: result})
                    }
                })
            }
        })
    }
    
}

exports.statistic = function(req, res, next){
    var token = req.header("Authorization") 
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if (err) {
                console.error('Error executing query: ' + err.stack)
                return
            }
            if(account[0].role_acc == "admin"){
                const today = new Date();
                const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                const startDay = startDate.toISOString().slice(0, 10);

                const endDay = today.toISOString().slice(0, 10);
                sql = `SELECT DATE(date_ticket) AS day, SUM(totalprice_ticket) AS revenue FROM ticket WHERE date_ticket BETWEEN '${startDay}' AND '${endDay}' GROUP BY DATE(date_ticket)`
                db.query(sql, (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json({msg: "Fail"})
                        return
                    }
                    else{
                        for(let i = 0; i < result.length; i++){
                            let temp = moment.tz(result[i].day, 'Asia/Ho_Chi_Minh')
                            result[i].day= temp.format("YYYY-MM-DD")
                        }
                        res.json({tickets: result})
                    }
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

exports.findOne = function(req, res, next){
    const ticketId = req.params.id
    const sql = `SELECT * FROM ${table} WHERE id_ticket = ?;`

    db.query(sql, [ticketId], (err, result)=>{
        if (err) {
            console.error('Error executing query: ' + err.stack)
            return
        }
        // let temp = moment.tz(result[0].date_ticket, 'Asia/Ho_Chi_Minh')
        // result[0].date_ticket = temp.format("YYYY-MM-DD")
        res.json({ticket: result})
    })
}


exports.create = function(req, res, next){
    var token = req.header("Authorization") 
    let sql = `SELECT * FROM acc WHERE id_acc = ?;`
    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        db.query(sql, [decode.id], (err, account)=>{
            if (err) {
                console.error('Error executing query: ' + err.stack)
                res.json(err.sqlMessage)
            }
            if(account[0].role_acc == "member"){
                sql = `SELECT * FROM seat`
                db.query(sql, (err, seat)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json(err.sqlMessage)
                    }
                    let check = 0
                    for(let i = 0; i < seat.length; i++)
                        for(let j = 0; j < req.body.seatId.length; j++)
                            if(seat[i].status_seat == 1 && seat[i].id_seat == req.body.seatId[j]){
                                check = 1
                                break
                            }
                    if(check == 1)
                        res.json({msg: "Full"})  
                    else{
                        for(let i = 0; i < req.body.seatId.length; i++){
                            sql = `INSERT INTO ${table} SET ?`
                            let day = new Date()
                            temp = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
                            console.log(account.id_acc)
                            const newTicket = {
                                id_showtime: req.body.showtimeId,
                                id_acc: account[0].id_acc,
                                id_seat: req.body.seatId[i],
                                totalprice_ticket: req.body.totalprice,
                                date_ticket: temp 
                            }
                            db.beginTransaction((err)=>{
                                if (err) reject(err);
                                db.query(sql, newTicket, (err, ticket)=>{
                                    if (err) {
                                        db.rollback(() => {
                                            reject(err);
                                        });
                                    }
                                    console.log(ticket)
                                    sql = `UPDATE seat SET status_seat = ? WHERE id_seat = ?`
                                    db.query(sql, [1, req.body.seatId[i]], (err, result)=>{
                                        if (err) {
                                            db.rollback(() => {
                                                reject(err);
                                            });
                                        }
                                        db.commit((err) => {
                                            if (err) {
                                            db.rollback(() => {
                                                reject(err);
                                            });
                                            }
                                            console.log('Transaction completed successfully!');
                                        });
                                        
                                    })
                                    
                                })
                            })  
                        }
                        res.json({msg: "Successfully"});
                    }
                    
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

// exports.update = function(req, res, next){
//     const ticketId = req.params.id
//     const date = req.body.date
//     const start = req.body.start
//     const price = Number(req.body.price)
//     const filmId = req.body.filmId
//     const roomId = req.body.roomId
//     const sql = `UPDATE ${table} SET date_ticket = ?, start_ticket = ?, price_ticket = ?, id_film = ?, id_room = ? WHERE id_ticket = ?`;

//     db.query(sql, [date, start, price, filmId, roomId, ticketId], (err, result)=>{
//         if (err) {
//             console.error('Error executing query: ' + err.stack);
//             return;
//         }
//         res.json({msg: `Update ticket with id = ${ticketId}`});
//     })
// }

// exports.delete = function(req, res, next){
//     const ticketId = req.params.id
//     const sql = `DELETE FROM ${table} WHERE id_ticket = ?`

//     db.query(sql, [ticketId], (err, result)=>{
//         if (err) {
//             console.error('Error executing query: ' + err.stack);
//             return;
//         }
//         res.json({msg: `Delete ticket with id = ${ticketId}`});
//     })
// }

// exports.deleteMany = function(req, res, next){
//     const ticketId = req.params.id.split("-")
//     for(let i = 0; i < ticketId.length; i++)
//         ticketId[i] = Number(ticketId[i])
//     const sql = `DELETE FROM ${table} WHERE id_ticket IN (?)`

//     db.query(sql, [ticketId], (err, result)=>{
//         if (err) {
//             console.error('Error executing query: ' + err.stack);
//             return;
//         }
//         res.json({msg: `Delete ticket with id = ${ticketId}`});
//     })
// }
