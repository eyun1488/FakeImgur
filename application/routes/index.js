var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var getRecentPosts = require('../middleware/postsmiddleware').getRecentPosts;
var db = require('../conf/database');


router.get('/', getRecentPosts, function (req, res, next) {
  res.render('index', { title: "Index", search: true });
});

router.get('/login', (req, res, next) => {
  res.render("login", { title: "Log In" });
});

router.get('/registration', (req, res, next) => {
  res.render("registration", { title: "Register", test: 1 });
});

router.use('/postimage', isLoggedIn);
router.get('/postimage', (req, res, next) => {
  res.render("postimage", { title: "Post Image" });
});

// router.get('/Imagepost', (req, res, next) => {
//   res.render("Imagepost", { title: "Image Post" });
// });

// after :id you can apply regex for either only digits or whatever you wish
// router.get('/post/:id(\\d+)', (req, res, next) => {
//   // res.render("Imagepost", { title: "Image Post" });
//   let baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
//   FROM users u \
//   JOIN posts p \
//   ON u.id=fk_userid \
//   WHERE p.id=?;";

//   let postId = req.params.id;
//   db.execute(baseSQL, [postId])
//     .then(([results, fields]) => {
//       if (results && results.length) {
//         let post = results;
//         req.session.viewing = req.params.id;
//         res.render('Imagepost', { currentPost: post });
//       } else {
//         req.flash('error', 'This is not the post you are looking for!');
//         res.redirect('/');
//       }
//     })
// });

router.get("/post/:id(\\d+)", async (req, res, next) => {
  try {
    var baseSQL = "SELECT u.username, p.title, p.description, p.photopath, p.created \
    FROM users u \
    JOIN posts p \
    ON u.id=fk_userid \
    WHERE p.id=?;";
    let [results, fields] = await db.execute(baseSQL, [req.params.id]);
    if (results && results.length) {
      let baseSQL2 = "SELECT  c.c_users_id, c.description, c.c_posts_id, c.created \
      FROM posts p \
      JOIN comments c \
      ON p.id = c_posts_id \
      WHERE p.id = ? \
      ORDER BY c.created DESC;"
      let [results2, fields2] = await db.execute(baseSQL2, [req.params.id]);
      req.session.viewing = req.params.id;
      res.render('Imagepost', {
        title: "Image Post",
        currentPost: results[0],
        comments: results2
      })
    } else {
      console.log("you messed up posting something cause you messed up! :)");
      res.redirect('/');
    }
  }
  catch (err) {
    console.log(err);
  }
});

// router.post('/search', async (req, res, next) => {
//   try {
//     let searchTerm = req.body.search;
//     if (!searchTerm) {
//       res.send({
//         resultsStatus: "info",
//         message: "No search term given.",
//         results: []
//       });
//       // res.redirect("/");
//     } else {
//       let baseSQL =
//         "SELECT id, title, description, thumbnail, concat_ws(' ', title, description) \
//       AS haystack \
//       FROM posts \
//       HAVING haystack like ?";
//       let sqlReadySearchTerm = "%" + searchTerm + "%";
//       let [results, fields] = await db.execute(baseSQL, [sqlReadySearchTerm]);

//       if (results && results.length) {
//         res.send({
//           resultsStatus: "info",
//           message: `${results.length} results found`,
//           results: results
//         });

//         // res.locals.results = results;
//         // res.render('index', { title: "Index" });

//       } else {
//         let [results, fields] = await db.query('SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 10', []);
//         res.send({
//           resultsStatus: "info",
//           message: "No results where found for your search but here are the 10 most recent posts",
//           results: results
//         });
//         // res.redirect("/");
//       }
//     }
//   } catch (err) {
//     next(err);
//   }
// })

// router.get('/home', (req, res, next) => {
//   res.render("homeA4", { title: "Home" });
// });

// router.get('*', (req, res, next) => {
//   res.render('error');
//   // console.log('error');
// });

module.exports = router;
