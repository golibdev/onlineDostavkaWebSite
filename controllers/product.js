const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// Add new products

exports.product = async (req, res) => {
    try {
        const {title, img, description, price} = req.body
        db.query("INSERT INTO products SET ? ", {title, img, description, price}, (err, results) => {
            if(err) {
                console.log(err)
            } else {
                return res.redirect('/dashboard/product')
            }
        })
    } catch (error) {
        console.log(error);
    }
};

// Add new orders
exports.order = async (req, res) => {
    try {
        const { name, region, city, adress, pochtalcode, tel, number } =
            req.body;
        db.query(
            "INSERT INTO orders SET ? ",
            {
                name: name,
                region: region,
                city: city,
                adress: adress,
                tel: tel,
                number: number,
                pochtalcode: pochtalcode,
            },
            async (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.redirect("/products");
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

// Deleted products
exports.deleteProduct = async (req, res) => {
    try {
        db.query(
            "DELETE FROM products WHERE id = ?",
            [req.params.id],
            (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/dashboard/list");
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};
