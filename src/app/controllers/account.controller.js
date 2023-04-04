const db = require("../../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const table = "acc"


exports.findAll = function(req, res, next){
    let sql = `SELECT * FROM ${table} WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")

        db.query(sql, [decode.id], (err, account)=>{
            if(account[0].role_acc == "admin"){
                sql = `SELECT * FROM ${table} where role_acc != ?;`

                db.query(sql, ["admin"], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        return
                    }
                    res.json({accounts: result})
                })
            }
            else{
                res.json({msg: "You are not allowed"})
            }
        })
        
    }
    else{
        res.json({msg: "You are not allowed"})
    }
    
}

exports.findOne = function(req, res, next){
    const accountId = req.params.id
    let sql = `SELECT * FROM ${table} WHERE id_acc = ?;`
    var token = req.header("Authorization") 

    if(token){
        token = token.substr(7)
        var decode = jwt.verify(token, "krystal")
        sql = `SELECT * FROM ${table} WHERE id_acc = ?;`
        db.query(sql, [decode.id], (err, account)=>{
            if (err) {
                console.error('Error executing query: ' + err.stack)
                res.json({msg: "Fail"})
                return
            }
            if(account[0].role_acc == "admin" || account[0].id_acc == accountId){
                db.query(sql, [accountId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack)
                        res.json({msg: "Fail"})
                        return
                    }
                    res.json({account: result})
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

exports.signUp = function(req, res, next){
    let sql = `SELECT * FROM ${table} WHERE username_acc = ? OR mail_acc = ?;`

    db.query(sql, [req.body.username, req.body.mail], (err, result)=>{
        if(err){
            console.error('Error executing query: ' + err.stack);
            return;
        }
        if(result.length > 0){
            res.json({msg: "This username or email has been used"})
        }
        else{
            sql = `INSERT INTO ${table} SET ?`

            const newAccount = {
                username_acc: req.body.username,
                password_acc: bcrypt.hashSync(req.body.password, 10),
                name_acc: req.body.username,
                mail_acc: req.body.mail,
                role_acc: "member"
            }

            db.query(sql, newAccount, (err, result)=>{
                if (err) {
                    console.error('Error executing query: ' + err.stack)
                    res.json(err.sqlMessage)
                }
                res.json({msg: "You have become a member of KTMOVIE"});
            })
        }
    })
}

exports.signIn = function(req, res, next){
    const username = req.body.username
    const password = req.body.password
    let sql = `SELECT * FROM ${table} WHERE username_acc = ?;`;

    db.query(sql, [username], (err, result)=>{
        if(err){
            console.error('Error executing query: ' + err.stack);
            return;
        }
        if(result.length > 0){              
            if(bcrypt.compareSync(password, result[0].password_acc)){
                var token = jwt.sign({id: result[0].id_acc}, "krystal", {expiresIn: 3600})
                const temp = Object.assign({}, result[0])
                delete temp.username_acc
                delete temp.password_acc
                delete temp.mail_acc
                delete temp.phone_acc
                res.json({msg: "Successfully", token: token, account: temp})
            }
            else{
                res.json({msg: "Wrong password"})
            }
        }
        else{
            res.json({msg: "Wrong username"})
        }
    })
}

exports.update = function(req, res, next){
    const accountId = req.params.id
    let sql = `SELECT * FROM ${table} WHERE id_acc = ?;`

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
            if(account[0].role_acc == "admin" && account[0].id_acc != accountId){
                const role = req.body.role
                sql = `UPDATE ${table} SET role_acc = ? WHERE id_acc = ?`

                db.query(sql, [role, accountId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update account with id = ${accountId}`});
                })
            }
            else if(account[0].id_acc == accountId){
                const name = req.body.name
                const phone = req.body.phone
                sql = `UPDATE ${table} SET name_acc = ?, phone_acc = ? WHERE id_acc = ?`;
                db.query(sql, [name, phone, accountId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Update account with id = ${accountId}`});
                })
            }
            else{
                res.json({msg: "You are not allowed"})
            }
        })
        
    }
    else{
        res.json({msg: "Fail"})
    }
}

exports.delete = function(req, res, next){
    const accountId = req.params.id
    let sql = `SELECT * FROM ${table} WHERE id_acc = ?;`

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
                sql = `DELETE FROM ${table} WHERE id_acc = ?`
                db.query(sql, [accountId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        res.json({msg: "Fail"})
                        return;
                    }
                    res.json({msg: `Delete account with id = ${accountId}`});
                })
            }
            else{
                res.json({msg: "Fail"})
            }
        })
    }

    
}

exports.deleteMany = function(req, res, next){
    const accountId = req.params.id.split("-")
    for(let i = 0; i < accountId.length; i++)
        accountId[i] = Number(accountId[i])
    let sql = `SELECT * FROM ${table} WHERE id_acc = ?;`
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
                sql = `DELETE FROM ${table} WHERE id_acc IN (?)`
                db.query(sql, [accountId], (err, result)=>{
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        return;
                    }
                    res.json({msg: `Delete account with id = ${accountId}`});
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
