const conn = require("../../database/conn");
const queries = {
    splashScreen:`SELECT name,description FROM splashdescription WHERE id = 1`,
    hairType:`SELECT id,name,description, CONCAT('http://localhost:3000',logo) as logo FROM hairtype_categories WHERE isEnabled = 1`,
    service:`SELECT id,name,description,CONCAT('http://localhost:3000',logo) as logo FROM service_categoryies WHERE isEnabled = 1`
}
class User {
    constructor() {}
    splashScreen(req,res) {
        this.getData(req,res,queries.splashScreen, true)
    }
    hairType(req,res){
        this.getData(req,res,queries.hairType, false)
    }
    service(req,res){
        this.getData(req,res,queries.service, false)
    }

    getData(req,res,query, first){
        conn.query(query, (err, data) => {
            if (err) {
                res.send({ status: 402, data:undefined,message:'error in Query',error:err });
            }
            if (data.length) {
                first ? res.send({ status: 200, data: data[0],message:'success',error:false }) : res.send({ status: 200, data: data,message:'success',error:false })
          }
        })
    }
}


module.exports = User;