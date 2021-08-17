var express = require('express');
var router = express.Router();
var db = require("../conf/database");
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require("../models/Posts");
var PostError = require('../helpers/error/PostError');
// const { route } = require('.');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/uploads")
    },
    filename: function (req, file, cb) {
        let fileExt = file.mimetype.split("/")[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`)
    }
});

var uploader = multer({ storage: storage });

router.post('/createPost', uploader.single("fileUpload"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userId = req.session.userId;
    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(
                title,
                description,
                fileUploaded,
                destinationOfThumbnail,
                fk_userId
            );
        })
        .then((postWasCreated) => {
            if (postWasCreated) {
                res.redirect('/');
            } else {
                throw new PostError("Post could not be created!", "postimage", 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        });
});

// localhost:3000/post/search?search=value
router.get('/search', async (req, res, next) => {
    try {
        let searchTerm = req.query.search;
        if (!searchTerm) {
            res.send({
                message: "No search term given.",
                results: []
            });
        } else {
            let results = await PostModel.search(searchTerm);
            if (results.length) {
                res.send({
                    message: `${results.length} results found`,
                    results: results
                });
            } else {
                let results = await PostModel.getNRecentPosts(10);
                res.send({
                    message: "No results where found for your search but here are the 10 most recent posts",
                    results: results
                });
            }
        }
    } catch (err) {
        next(err);
    }
})


router.post('/comments', (req, res, next) => {
    let comment = req.body.comment;
    let fk_userId = req.session.userId;
    let postId = req.session.viewing;
    let baseSQL = "INSERT INTO comments (created, description, c_posts_id, c_users_id) VALUES (now(), ?, ?, ?);";
    db.execute(baseSQL, [comment, postId, fk_userId]);
    res.redirect('/post/' + postId);
})


module.exports = router;
