var express = require("express");
var router = express.Router();
var userQuery = require("../../database/Api/user");
let query = new userQuery();

router.post('/lVFUtZbAjQg8SkzBJjSzvatvm/signIn', (req, res) => {
    console.log({data:req.body})
    if (req.body.email && req.body.contactNumber && req.body.name) {
        return res.send({status:200})
    } else {
        if(!req.body.name){
            return res.send({ status: 401,error:true,message:'Name filed is required',data:undefined })
        }else if(!req.body.email){
            return res.send({ status: 401,error:true,message:'Email filed is required',data:undefined })
        }
        else if(!req.body.contactNumber){
            return res.send({ status: 401,error:true,message:'Contact Number filed is required',data:undefined })
        }
        else{
            return res.send({ status: 400,error:true,data:undefined,message:"missing required parameter" })
        }
    }
})

module.exports = router;