const path = require("path");
const express = require("express");
const session = require("express-session");
const fileUpload = require('express-fileupload')
const dotenv = require("dotenv");
const mysql = require("mysql");
const hbs = require('hbs')
const app = express();

//default option
app.use(fileUpload())

// Static files
app.use(express.static('public'))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

app.use(
    session({
        secret: `${process.env.SECRET_KEY}`,
        resave: false,
        saveUninitialized: false,
    })
);
// Public folder

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
    host: `${process.env.DATABASE_HOST}`,
    user: `${process.env.DATABASE_USER}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE}`,
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Mysql connected...");
    }
});

app.use("/", require("./routes/page"));
app.use("/auth", require("./routes/auth"));
app.use("/order", require("./routes/product"));
app.use("/products", require("./routes/product"));
app.use("/dashboard/products", require("./routes/product"));
app.post('/add/dashboard/product', (req, res) => {
    let sampleFile
    let uploadPath

    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).redirect('/dashboard/product')
    }

    sampleFile = req.files.img
    uploadPath = __dirname + '/public/uploads/' + sampleFile.name
    const {title, description, price} = req.body

    sampleFile.mv(uploadPath, function(err) {
        if(err) return res.status(500).send(err) 

        db.query('INSERT INTO products SET ? ', {title: title, img: sampleFile.name, description: description, price: price}, (err, results) => {
            if(err) {
                console.log(err)
            } else {
                res.redirect('/dashboard/product')
            }
        })
    })
})


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server has been started ${PORT}...`);
});
