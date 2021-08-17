var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const UserModel = require('../models/Users');
const UserError = require('../helpers/error/UserError');
const { successPrint, errorPrint } = require('../helpers/debug/debugprinters');
var bcrypt = require('bcrypt');
var flash = require('express-flash');
var { body, validationResult } = require('express-validator');


// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });
// router.post('/register', (req, res, next) => {
router.post('/register', [body("email").isEmail()], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // catch errors
    res.redirect("/");
  } else {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;

    /**
     * do server side validation
     * not done with Souza
     */

    UserModel.usernameExists(username)
      .then((userDoesNameExist) => {
        if (userDoesNameExist) {
          throw new UserError(
            "Registration Failed: Username already exists",
            "/registration",
            200
          );
        } else {
          return UserModel.emailExists(email);
        }
      })
      .then((emailDoesExist) => {
        if (emailDoesExist) {
          throw new UserError(
            "Registration Failed: Email already exists",
            "/registration",
            200
          );
        } else {
          return UserModel.create(username, password, email);
        }
      })
      .then((createdUserId) => {
        if (createdUserId < 0) {
          throw new UserError(
            "Server Error, user could not be created",
            "/registration",
            500
          );
        } else {
          successPrint("Users.js --> was created!!");
          req.flash('success', 'User account has been made!');
          res.redirect('/login');
        }
      })
      .catch((err) => {
        errorPrint("user could not be made", err);
        if (err instanceof UserError) {
          errorPrint(err.getMessage());
          req.flash('error', err.getMessage());
          res.status(err.getStatus());
          res.redirect(err.getRedirectURL());
        } else {
          next(err);
        }
      });
  }
  // let username = req.body.username;
  // let email = req.body.email;
  // let password = req.body.password;
  // let confirmpassword = req.body.confirmpassword;

  // /**
  //  * do server side validation
  //  * not done with Souza
  //  */

  // UserModel.usernameExists(username)
  //   .then((userDoesNameExist) => {
  //     if (userDoesNameExist) {
  //       throw new UserError(
  //         "Registration Failed: Username already exists",
  //         "/registration",
  //         200
  //       );
  //     } else {
  //       return UserModel.emailExists(email);
  //     }
  //   })
  //   .then((emailDoesExist) => {
  //     if (emailDoesExist) {
  //       throw new UserError(
  //         "Registration Failed: Email already exists",
  //         "/registration",
  //         200
  //       );
  //     } else {
  //       return UserModel.create(username, password, email);
  //     }
  //   })
  //   .then((createdUserId) => {
  //     if (createdUserId < 0) {
  //       throw new UserError(
  //         "Server Error, user could not be created",
  //         "/registration",
  //         500
  //       );
  //     } else {
  //       successPrint("Users.js --> was created!!");
  //       req.flash('success', 'User account has been made!');
  //       res.redirect('/login');
  //     }
  //   })
  //   .catch((err) => {
  //     errorPrint("user could not be made", err);
  //     if (err instanceof UserError) {
  //       errorPrint(err.getMessage());
  //       req.flash('error', err.getMessage());
  //       res.status(err.getStatus());
  //       res.redirect(err.getRedirectURL());
  //     } else {
  //       next(err);
  //     }
  //   });



  // db.execute("SELECT * FROM users WHERE username=?", [username])
  //   .then(([results, fields]) => {
  //     if (results && results.length == 0) {
  //       return db.execute("SELECT * FROM users WHERE email=?", [email]);
  //     } else {
  //       throw new UserError(
  //         "Registration Failed: Username already exists",
  //         "/registration",
  //         200
  //       );
  //     }
  //   })
  //   .then(([results, fields]) => {
  //     if (results && results.length == 0) {
  //       return bcrypt.hash(password, 10);
  //     } else {
  //       throw new UserError(
  //         "Registration Failed: Email already exists",
  //         "/registration",
  //         200
  //       );
  //     }
  //   })
  //   // .then(([results, fields]) => {
  //   .then((hashedPassword) => {
  //     // if (results && results.length == 0) {
  //     let baseSQL = "INSERT INTO users (`username`, `email`, `password`, `created`) VALUES (?, ?, ?, now());";
  //     return db.execute(baseSQL, [username, email, hashedPassword]);
  //     // return db.execute(baseSQL, [username, email, password]);
  //     // } else {
  //     //   throw new UserError(
  //     //     "Registration Failed: Email already exists",
  //     //     "/registration",
  //     //     200
  //     //   );
  //     // }
  //   })
  //   .then(([results, fields]) => {
  //     if (results && results.affectedRows) {
  //       successPrint("Users.js --> was created!!");
  //       res.redirect('/login');
  //     } else {
  //       throw new UserError(
  //         "Server Error, user could not be created",
  //         "/registration",
  //         500
  //       );
  //     }
  //   })
  //   .catch((err) => {
  //     errorPrint("user could not be made", err);
  //     if (err instanceof UserError) {
  //       errorPrint(err.getMessage());
  //       res.status(err.getStatus());
  //       res.redirect(err.getRedirectURL());
  //     } else {
  //       next(err);
  //     }
  //   });
}); // end of register

router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  /**
   * do server side validation 
   * not done in video must do on your own
   */

  UserModel.authenticate(username, password)
    .then((loggedUserId) => {
      if (loggedUserId > 0) {
        successPrint(`User ${username} is logged in`);
        // res.cookie("logged", username, { expires: new Date(Date.now() + 900000), httpOnly: false });
        req.session.username = username; // init your session
        req.session.userId = loggedUserId; // DON'T USE .id on session
        res.locals.logged = true;
        req.flash('success', 'You have successfully logged in');
        res.redirect('/');
        // res.render("index");
      } else {
        throw new UserError("Invalid username and/or password!", "/login", 200);
      }
    })
    .catch((err) => {
      if (err instanceof UserError) {
        errorPrint(err.getMessage);
        req.flash('error', err.getMessage());
        res.status(err.getStatus());
        res.redirect('/login'); // change to postimage
      } else {
        next(err);
      }
    })
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('Session could not be destroyed.')
      next(err);
    } else {
      successPrint('Session is destroyed.');
      res.clearCookie('csid');
      res.json({ status: "OK", message: "User is logged out." });
    }
  })
});


module.exports = router;