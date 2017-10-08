var express = require('express');

var aws = require('aws-sdk');
var router = express.Router();
var multerS3 = require('multer-s3');
var multer = require('multer');

aws.config.loadFromPath('./config.json');
aws.config.update({
    signatureVersion: 'v4'
})

var s0 = new aws.S3({});

var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'www.upload.com', 
        acl: 'public-read',

        //name of file
        metadata: function(req, file, cb) {
            cb(null, {
                fieldname: file.fieldname
            });
        },
        //unique description/date for the file
        key: function(req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })
})

router.get('/profile/upload', function(req, res, next) {
    res.render('index');
})

router.get('/public/images', function(req, res, next) {
    res.render('index');
})

router.post('/profile/upload', upload.any(), function(req, res, next) {
    res.send(req.files);
    console.log(req.files)
})

module.exports = router;
