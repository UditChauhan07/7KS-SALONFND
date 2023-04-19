class Query {
  constructor() {}
  create(table, data) {
    let attr = Object.keys(data);
    let base = `INSERT INTO ${table}`;
    let dbAttr = "VALUES";
    let query = this.createBuilder(base, dbAttr, attr, data);
    return query;
  }
  edit(table, data) {
    let attr = Object.keys(data);
    let base = `UPDATE ${table} SET `;
    let query = this.editBuilder(base, attr, data);
    // console.log("boo");
    return query;
  }
  multi(operation, table, cases = null, index =null) {
    if(table == 'users'){
      if(operation == 'SELECT'){
        return `SELECT users.id, users.roleId, roles.name AS roleName, users.fullName, users.email, users.contactNumber,users.verifyStatus, users.isEnabled, users.profilePic,roles.permission, addresses.addressfield1, addresses.addressfield2, addresses.addressfield3, addresses.addressfield4, addresses.addressfield5, addresses.addressfield6, addresses.addressfield7,addresses.addressfield8,countries.name as addressfield8Name, users.ethnicityId, ethnicities.name as ethnicityName FROM users INNER JOIN roles ON users.roleId=roles.id LEFT JOIN addresses ON users.id= addresses.userId LEFT JOIN ethnicities ON users.ethnicityId=ethnicities.id LEFT JOIN countries on addresses.addressfield8 = countries.id WHERE users.roleId=${index} `
      }
    }
    if(table == 'hairtype_subcategories'){
      if(operation == 'SELECT'){
        return 'SELECT hairtype_subcategories.id, hairtype_subcategories.hairCatId, hairtype_categories.name as hairCatName, hairtype_subcategories.name, hairtype_subcategories.description, hairtype_subcategories.isEnabled as hairSubEnabled,hairtype_subcategories.hairSubMergeId, hairtype_submergecategories.name as hairSubMergeName, hairtype_submergecategories.isEnabled as hairSubMergeEnabled, hairtype_categories.isEnabled as hairCatEnabled,hairtype_subcategories.logo FROM `hairtype_subcategories` INNER JOIN hairtype_categories ON hairtype_subcategories.hairCatId=hairtype_categories.id INNER JOIN hairtype_submergecategories ON hairtype_subcategories.hairSubMergeId=hairtype_submergecategories.id;'
      }
    }
    if(table == 'salons'){
      if(operation == 'SELECT'){
        return 'SELECT salons.id, salons.userId, salons.createdBy, salons.name,salons.logo,salons.email,salons.contactNumber, salons.alternateNumber,salons.rating, salons.userInteraction, salons.verifyStatus, salons.isEnabled, users.fullName as salonOwner,salon_openings.mon,salon_openings.tues, salon_openings.wed, salon_openings.thus, salon_openings.fri, salon_openings.sat, salon_openings.sun FROM `salons` INNER JOIN users ON salons.userId=users.id LEFT JOIN salon_openings ON salons.id= salon_openings.salonId'
      }
    }
    if(table == 'service_subcategories'){
      if(operation == 'SELECT'){
        return 'SELECT service_subcategories.id, service_subcategories.serviceCatId, service_categoryies.name as serviceCatName,service_subcategories.name, service_subcategories.description, service_subcategories.isEnabled FROM service_subcategories INNER JOIN service_categoryies ON service_subcategories.serviceCatId=service_categoryies.id'
      }
    }
    if(table == 'services'){
      if(operation == 'SELECT'){
        return 'SELECT services.id, services.serviceCatId, service_categoryies.name as serviceCatName, services.businesstypeId, businesstype.name as businesstypeName ,services.name,services.logo, services.description, services.isEnabled FROM services INNER JOIN service_categoryies ON services.serviceCatId=service_categoryies.id INNER JOIN businesstype ON services.businesstypeId=businesstype.id'
      }
    }
    if(cases == null) return `${operation} * FROM ${table} ;`;
    return `${operation} * FROM ${table} ${cases}`;
  }

  createBuilder(base, attr, material, data) {
    let piece1 = "";
    let piece2 = "";
    if (material.length) {
      material.forEach((a, i) => {
        if (i == 0) {
          piece1 += "(";
          piece2 += "(";
        }
        piece1 += a;
        piece2 += "'"+data[a] + "'";
        if (i != material.length - 1) {
          piece1 += ",";
          piece2 += ",";
        }
        if (i == material.length - 1) {
          piece1 += ")";
          piece2 += ")";
        }
      });
    }
    return base + piece1 + attr + piece2;
  }
  editBuilder(base,material, data) {
    let piece = "";
    let cases = "";
    if (material.length) {
      material.forEach((a, i) => {
        if(a.toLowerCase() != 'where'){
            piece += a + "='" + data[a] +"' ";
            if(i != material.length - 2){piece += ','}
            if (i == material.length - 2) {

                cases += ";";
            }
        }else{
            let c = Object.keys(data.where);
            console.log(c);
            cases = ' WHERE'
            c.forEach(b => {
                cases += ' '+b+'=' +data.where[b];
            });
            cases += ';'
        }
      });
    }
    return base + piece + cases;
  }

  deleteIndex(table,id){
    return `DELETE FROM ${table} WHERE id=${id}`
  }
  oneUserIndex(id){
    return `SELECT * FROM users WHERE id=${id}`;
  }
  userIndex(){
    return `SELECT * FROM users`;
  }
  addressindex(){
    return `SELECT * FROM addresses`;
  }
  oneAddressIndex(id){
    return `SELECT * FROM addresses WHERE userId=${id}`;
  }
  oneUserAddressIndex(id){
    return `SELECT users.id,users.roleId,users.fullName, users.email, users.contactNumber,users.profilePic, users.ethnicityId,users.isEnabled, addresses.addressfield1, addresses.addressfield2, addresses.addressfield3, addresses.addressfield4, addresses.addressfield5,addresses.addressfield6,addresses.addressfield7, addresses.addressfield8 FROM users LEFT JOIN addresses ON users.id=addresses.userId WHERE users.id=${id}`
  }
  oneServiceIndex(id){
    return `SELECT * FROM services WHERE id=${id}`;
  }
  oneBuisnessIndex(id){
    return `SELECT * FROM businesstype WHERE id=${id}`
  }
  buisnessDelete(id){
    return `DELETE FROM businesstype WHERE id=${id}`;
  }

  oneUserAddressDelete(id){
    return `DELETE FROM users WHERE id=${id};`
  }
  ethnicitiesList() {
    return `SELECT * FROM ethnicities`;
  }
  ethnicitiesinsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO ethnicities(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  ethnicitiesedit() {
    return "SELECT * FROM ethnicities";
  }
  ethnicitiesdelete(id) {
    return `DELETE FROM ethnicities WHERE id=${id}`;
  }

  AuthUser(id){
    return `SELECT users.id,users.roleId, roles.name as roleName, users.fullName, users.email, users.contactNumber,users.profilePic, users.ethnicityId,users.isEnabled, roles.permission, addresses.addressfield1, addresses.addressfield2, addresses.addressfield3, addresses.addressfield4, addresses.addressfield5,addresses.addressfield6,addresses.addressfield7, addresses.addressfield8 FROM users INNER JOIN roles ON users.roleId=roles.id LEFT JOIN addresses ON users.id=addresses.userId WHERE users.id=${id};`
  }

  isExisted(data){
    return `SELECT * FROM users WHERE email='${data.email}' OR contactNumber='${data.contact}';`;
  }


  hairtypecategoriesList() {
    return `SELECT * FROM hairtype_categories`;
  }
  
  activeHairtypecategoriesList() {
    return `SELECT * FROM hairtype_categories WHERE isEnabled=1`;
  }
  activeHairtypeSubMergeList() {
    return `SELECT * FROM hairtype_submergecategories WHERE isEnabled=1`;
  }
  onehairtypecategories(id) {
    return `SELECT * FROM hairtype_categories WHERE id=${id}`;
  }
  onehairSubCategoryIndex(id) {
    return `SELECT * FROM hairtype_submergecategories WHERE id=${id}`;
  }
  onehairSubCatIndex(id) {
    return `SELECT * FROM hairtype_subcategories WHERE id=${id}`;
  }
  countriesIndex(){
    return `SELECT * FROM countries`;
  }
  hairtypecategoriesinsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO hairtype_categories(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }


  //business type resalted query
  getBusinessTypeIndex(id){
    return `SELECT * FROM businesstype WHERE id=${id}`;
  } 
  allBusinessTypeIndex(){
    return `SELECT * FROM businesstype WHERE isEnabled=1`;
  } 
  //end here

  oneServiceCategoryDelete(id){
    return `DELETE FROM service_categoryies WHERE id=${id}`;
  }
  oneServiceCategoryIndex(id){
    return `SELECT * FROM service_categoryies WHERE id=${id}`;
  }

  serviceCategoryiesIndex() {
    return `SELECT * FROM service_categoryies`;
  }
  oneServiceWithCategoryIndex(){
    return `SELECT service_subcategories.id, service_subcategories.serviceCatId, service_categoryies.name as serviceCatName, service_subcategories.name, service_subcategories.description, service_subcategories.logo,service_subcategories.isEnabled, service_subcategories.createdAt FROM service_subcategories INNER JOIN service_categoryies ON service_subcategories.serviceCatId=service_categoryies.id`;
  }
  oneServiceWithCategory(id){
    return `SELECT service_subcategories.id, service_subcategories.serviceCatId, service_categoryies.name as serviceCatName, service_subcategories.name, service_subcategories.description, service_subcategories.logo,service_subcategories.isEnabled, service_subcategories.createdAt FROM service_subcategories INNER JOIN service_categoryies ON service_subcategories.serviceCatId=service_categoryies.id WHERE service_subcategories.id=${id}`;
  }
  hairtypecategoriesedit() {
    return "SELECT * FROM hairtype_categories";
  }
  hairtypecategoriesdelete(id) {
    return `DELETE FROM hairtype_categories WHERE id=${id}`;
  }
  hairTypeSubCategoriesList() {
    return `SELECT * FROM hairtype_subcategories`;
  }
  hairTypeSubCategoriesInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO hairtype_subcategories(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  hairTypeSubCategoriesEdit() {
    return "SELECT * FROM hairtype_subcategories";
  }
  hairTypeSubCategoriesDelete(id) {
    return `DELETE FROM hairtype_subcategories WHERE id=${id}`;
  }
  salonsList() {
    return `SELECT * FROM salons`;
  }
  salonsInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO salons(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  salonsIndex(id) {
    return `SELECT * FROM salons WHERE id=${id}`;
  }
  salonsDelete(id) {
    return `DELETE FROM salons WHERE id=${id}`;
  }
  salonOpeningList() {
    return `SELECT * FROM salon_openings`;
  }
  salonOpeningInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO salon_openings(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  salonOpeningEdit() {
    return "SELECT * FROM salon_openings";
  }
  salonOpeningDelete(id) {
    return `DELETE FROM salon_openings WHERE id=${id}`;
  }
  salonUserRatingsList() {
    return `SELECT * FROM salon_user_ratings`;
  }
  salonUserRatingsInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO salon_user_ratings(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  salonUserRatingsEdit() {
    return "SELECT * FROM salon_user_ratings";
  }
  salonUserRatingsDelete(id) {
    return `DELETE FROM salon_user_ratings WHERE id=${id}`;
  }
  searchKeywordsList() {
    return `SELECT * FROM search_keywords`;
  }
  searchKeywordsInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO search_keywords(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  searchKeywordsEdit() {
    return "SELECT * FROM search_keywords";
  }
  searchKeywordsDelete(id) {
    return `DELETE FROM search_keywords WHERE id=${id}`;
  }
  servicesList() {
    return `SELECT * FROM ${table}`;
  }
  servicesInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO services(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  servicesEdit() {
    return "SELECT * FROM services";
  }
  servicesDelete(id) {
    return `DELETE FROM services WHERE id=${id}`;
  }
 
  serviceCategoryiesInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO service_categoryies(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  businessType(){
    return `SELECT * FROM businesstype WHERE isEnabled=1`;
  }
  serviceCategoryiesEdit() {
    return "SELECT * FROM service_categoryies";
  }
  serviceCategoryiesDelete(id) {
    return `DELETE FROM service_categoryies WHERE id=${id}`;
  }
  serviceSubCategoriesList() {
    return `SELECT * FROM service_subcategories`;
  }
  serviceSubCategoriesInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO service_subcategories(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  serviceSubCategoriesEdit() {
    return "SELECT * FROM service_subcategories";
  }
  serviceSubCategoriesDelete(id) {
    return `DELETE FROM service_subcategories WHERE id=${id}`;
  }
  usersList() {
    return `SELECT * FROM users`;
  }

  userAddressDelete(userId){
    return `DELETE FROM addresses WHERE userId=${userId}`;
  }
  businessCategoriesList(id){
    return `SELECT * FROM businesscategories WHERE businessId =${id}`;
  }
  businessServiceList(id){
    return `SELECT * FROM businessservices WHERE businessId =${id}`;
  }
  salonEdit(id){
    return `SELECT business.id as businessId, business.name as businessName,business.logo as businessLogo,business.email as businessEmail,business.longitude,business.latitude,business.contactNumber as businessContactNumber, business.alternateNumber as businessAlternateNumber,business.rating as businessRating, business.verifyStatus as businessVerifyStatus, business.isEnabled as businessIsEnabled, users.id as salonOwnerId,users.fullName as salonOwnerName,users.email as salonOwnerEmail, users.contactNumber as salonOwnerPhone, addresses.addressfield1,addresses.addressfield2,addresses.addressfield3,addresses.addressfield4,addresses.addressfield8 FROM business INNER JOIN users ON business.userId=users.id INNER JOIN addresses ON business.userId=addresses.userId WHERE business.id=${id} LIMIT 1;;`
  }
  usersInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO users(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  usersEdit() {
    return "SELECT * FROM users";
  }
  usersDelete(id) {
    return `DELETE FROM users WHERE id=${id}`;
  }
  userDetailList() {
    return `SELECT * FROM users`;
  }
  userDetailInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO user_detail(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  userDetailEdit() {
    return "SELECT * FROM user_detail";
  }
  userDetailDelete(id) {
    return `DELETE FROM user_detail WHERE id=${id}`;
  }
  userSalonWishlistList() {
    return `SELECT * FROM user_salon_wishlist`;
  }
  userSalonWishlistInsert(data) {
    let attr = Object.keys(data);
    return `INSERT INTO user_salon_wishlist(name, description, isEnabled) VALUES ('[value-1]','[value-2]','[value-3]')`;
  }
  userSalonWishlistEdit() {
    return "SELECT * FROM user_salon_wishlist";
  }
  userSalonWishlistDelete(id) {
    return `DELETE FROM user_salon_wishlist WHERE id=${id}`;
  }

  salesSearch(key){
    return `SELECT users.id, users.roleId, roles.name AS roleName, users.fullName, users.email, users.contactNumber,users.verifyStatus, users.isEnabled, users.profilePic,roles.permission, addresses.addressfield1, addresses.addressfield2, addresses.addressfield3, addresses.addressfield4, addresses.addressfield5, addresses.addressfield6, addresses.addressfield7,addresses.addressfield8,countries.name as addressfield8Name, users.ethnicityId, ethnicities.name as ethnicityName FROM users INNER JOIN roles ON users.roleId=roles.id LEFT JOIN addresses ON users.id= addresses.userId LEFT JOIN ethnicities ON users.ethnicityId=ethnicities.id LEFT JOIN countries on addresses.addressfield8 = countries.id WHERE users.roleId=3 AND users.fullName LIKE '${key}%' OR addresses.addressfield1 LIKE '${key}%' OR addresses.addressfield2 LIKE '${key}%' OR addresses.addressfield3 LIKE '${key}%' OR addresses.addressfield4 LIKE '${key}%' OR countries.name LIKE '${key}%' GROUP BY users.id`;
  }
}

module.exports = Query;
