const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
  host: `${process.env.DATABASE_HOST}`,
  user: `${process.env.DATABASE_USER}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE}`,
});

exports.register = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "SELECT email FROM user WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.log(err);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "That email is already taken",
        });
      } else if (name.length === 0 || email.length === 0) {
        return res.render("register", {
          message: "The form is incomplete",
        });
      } else if (password.length < 6) {
        return res.render("register", {
          message:
            "Pasword length The password must be at least 8 characters long",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Password do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      db.query(
        "INSERT INTO user SET ?",
        { name: name, email: email, password: hashedPassword },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res.redirect("/login");
          }
        }
      );
    }
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    db.query(
      "SELECT * FROM user WHERE email = ?",
      [email],
      async (err, results) => {
        if(err) {
          res.render("login", {
            message: "Email or Password is incorrect",
          });
        } else if (results.length == 0) {
          res.render("login", {
            message: "Email or Password is incorrect",
          });
        } else {
          let user = results[0]

          bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
              res.render("login", {
                message: "Email or Password is incorrect",
              });
            } else {
              req.session.isAuth = true
              res.redirect('/dashboard')
            }
          })
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
