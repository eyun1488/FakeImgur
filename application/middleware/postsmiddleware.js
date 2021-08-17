var PostModel = require('../models/Posts');
const postMiddleWare = {}

postMiddleWare.getRecentPosts = async function (req, res, next) {
    try {
        let results = await PostModel.getNRecentPosts(10);
        res.locals.results = results;
        if (results.length == 0) {
            // req.flash('error', 'There are no post create yet!');
        }
        next();
    } catch (err) {
        next(err);
    }


    // let baseSQL = 'SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT 10';
    // db.execute(baseSQL, [])
    //     .then(([results, fields]) => {
    //         // appending results to our res.locals OR req.locals that will overwrite
    //         res.locals.results = results;
    //         if (results && results.length == 0) {
    //             req.flash('error', 'There are no posts created yet.');
    //         }
    //         next();
    //     })
    //     .catch((err) => next(err));
}

module.exports = postMiddleWare;