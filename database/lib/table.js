class Table{
    constructor(){
        this.tables = {
            user: "users",
            admin:'users',
            sales:'users',
            salonuser:"users",
            wishlist: "user_salon_wishlist",
            hairCategory: "hairtype_categories",
            hairSubCategory: "hairtype_submergecategories",
            hairType: "hairtype_subcategories",
            role: "roles",
            salon: "business",
            business: "businesstype",
            salonopening: "salon_openings",
            salonuserrate: "salon_user_ratings",
            search: "search_keywords",
            service: "services",
            serviceCategory: "service_categoryies",
            usersetail: "user_detail",
            usersalonwishlist: "user_salon_wishlist",
            countries:"countries",
            address:"addresses"
          };
    }
    focus(){
        return this.tables
    }
}
module.exports = Table