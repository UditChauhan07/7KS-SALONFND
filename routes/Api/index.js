var express = require('express');
let path = require("path");
let multer = require("multer");
var router = express.Router();
var onboardingQuery = require("../../database/Api/onboarding");
let query = new onboardingQuery();
const Response = require("../../service/api/response");
const response = new Response();
const xHeaderCheck = ['root', 'Ow8lEMVpIgkKTdx4GbJC1UPUp-3WONJtCivf0PFmf0qYj6DbdEI'];
const token = 'secretkey';
const userToken = 'privatekey';

const storage = multer.diskStorage({
  destination: './public/uploads/userProfile/',
  filename: function (req, file, cb) {
    cb(null, 'US-' + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1000000 }
}).single('profilePic');

/* GET users listing. */
router.post("/", (req, res) => {
  return res.send({ status: 400 })
});


router.get('/', (req, res) => {
  res.send({ stauts: 200 })
})
router.post('/changeProfilePic', function (req, res, next) {
  if (req.headers[token]) {
    if (xHeaderCheck.includes(req.headers[token])) {
      if (req.headers[userToken]) {
        upload(req, res, (err) => {
          if (err) {
            response.response(res, 404, undefined, 'Error in file uploading',true)
          } else {
            let fullpath = req.file.destination.split("./public");
            const data = { logo: fullpath[1] + req.file.filename,token:req.headers[userToken] }
            query.changeProfilePic(req,res,data)
          }
        })
      } else {
        response.response(res, 404, undefined, 'user unauthorized', true)
      }
    } else {
      response.response(res, 404, undefined, 'unauthorized',true)
    }
  } else {
    response.response(res, 404, undefined, 'unauthorized',true)
  }
});

module.exports = router;
