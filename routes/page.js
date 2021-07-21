const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host: `${process.env.DATABASE_HOST}`,
    user: `${process.env.DATABASE_USER}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE}`,
});

const resultsPerPage = 12;

router.get("/products", (req, res) => {
    db.query("SELECT * FROM products", async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render("allproducts", {
                results
            });
        }
    });
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect("/login");
    }
};

router.get("/dashboard", isAuth, (req, res) => {
    db.query("SELECT * FROM orders", async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            var date = new Date();
            var month = date.getMonth();
            var day = date.getDay();
            var year = date.getFullYear();
            const len = results.length;
            res.render("dashboard", {
                results,
                len,
                month,
                day,
                year,
            });
        }
    });
});

router.get("/logout", (req, res) => {
    res.redirect("/login");
});

router.get("/dashboard/product", isAuth, (req, res) => {
    res.render("product");
});

router.get("/dashboard/list", isAuth, (req, res) => {
    db.query("SELECT * FROM products", async (err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.render("productlist", {
                results,
            });
        }
    });
});

router.get("/product/:id", (req, res) => {
    const productId = req.params.id;

    db.query(
        "SELECT * FROM products WHERE id = ?",
        productId,
        (err, results) => {
            if (err) {
                console.log(err);
            } else {
                res.render("products", {
                    results: results[0],
                });
            }
        }
    );
});

module.exports = router;
