var express = require('express');
let path = require("path");
let multer = require("multer");
var router = express.Router();

const storage = multer.diskStorage({
    destination:'./public/uploads/userprofile/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({
    storage:storage,
    limits:{fieldSize:1000000}
}).single('file');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('test');
});


router.post('/', function(req, res, next) {
    console.log("boooo",req.body.test);
    upload(req,res,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log(req.file);
            res.send("booo")
        }
    })
  });

module.exports = router;
