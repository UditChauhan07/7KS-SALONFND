class Response{
    response (res,status,data,message,error){
        if(data){
            // data = JSON.stringify(data)
            return res.send({ status, data, message, error });
        }else{
            return res.send({ status, data, message, error });
        }
    }
}

module.exports = Response;