const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const sharp = require('sharp');

// const config = require('../config');

const BUCKET = 'dranner'
const REGION = 'us-east-1'
const ACCESS_KEY = 'AKIARDJSX6CA726GTO4P'
const SECRET_KEY = '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'

const s3Config = new AWS.S3({
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  Bucket: BUCKET,
  region: REGION
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}


const multerS3Config = multerS3({
  s3: s3Config,
  bucket: 'dranner',
  cacheControl: 'max-age=31536000',
  metadata: function (req, file, cb) {
    cb(null, {
      fieldName: file.fieldname
    });
  },
  key: function (req, file, cb) {
    // cb(null, new Date().toISOString() + '-' + file.originalname)
    // cb(null, '1')
    var newFileName = file.originalname;
    var fullPath = 'drannerimgs/' + newFileName;
    cb(null, fullPath);
  },
  shouldTransform: function (req, file, cb) {
    cb(null, /^image/i.test(file.mimetype))
  },
  transforms: [{
    id: 'original',
    key: function (req, file, cb) {
      cb(null, 'image-original.jpg')
    },
    transform: function (req, file, cb) {
      cb(null, sharp().jpg())
    }
  }, {
    id: 'thumbnail',
    key: function (req, file, cb) {
      cb(null, 'image-thumbnail.jpg')
    },
    transform: function (req, file, cb) {
      cb(null, sharp().resize(100, 100).jpg())
    }
  }]
});

const upload = multer({
  storage: multerS3Config,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
  },
});


module.exports = upload;