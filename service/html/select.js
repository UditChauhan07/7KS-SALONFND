class Select {
    draw(data, index){
        let status = {};
        data.forEach(element => {
            if(element.id == index){
                status[element.id] = true;
            }else{
                status[element.id] = false;
            }
        });
        return status;
    }
}
module.exports = Select;