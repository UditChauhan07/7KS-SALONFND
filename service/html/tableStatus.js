class TableStatus{
    constructor(){
        this.tableStatus = undefined;
    }
    draw(data){
        this.tableStatus = {
            business:false,
            user: false,
            wishlist: false,
            ethnicity: false,
            haircat: false,
            hairsub: false,
            role: false,
            salon: false,
            salonopening: false,
            salonuserrate: false,
            search: false,
            service: false,
            servicecat: false,
            servicesub: false,
            userdetail: false,
            usersalonwishlist: false,
        }
        this.tableStatus[data] = true;
        return this.tableStatus;
    }
}
module.exports = TableStatus;