const mysql = require('mysql')

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

exports.deleteOrder = async (req, res) => {
    try {
        db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err, results) => {
            if(err) {
                console.log(err)
            } else {
                res.redirect('/dashboard/')
            }
        })
    } catch (error) {
        console.log(error)
    }
}