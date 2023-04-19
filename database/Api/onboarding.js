const conn = require("../../database/conn");
const Response = require("../../service/api/response");
const OtpSender = require("../../service/mail/otp");
const sendOTP = new OtpSender();
const response = new Response();
const host = 'http://localhost:3000';
const queries = {
    splashScreen: `SELECT name,description FROM splashdescription WHERE id = 1`,
    hairType: `SELECT id,name,description, CONCAT('${host}',logo) as logo FROM hairtype_categories WHERE isEnabled = 1`,
    service: `SELECT id,name,description,CONCAT('${host}',logo) as logo FROM service_categoryies WHERE isEnabled = 1`,
    businessType: `SELECT id,name,description,CONCAT('${host}',logo) as logo FROM businesstype WHERE isEnabled = 1`,
}
class onBoarding {
    constructor() { }
    splashScreen(req, res) {
        this.getData(req, res, queries.splashScreen, true)
    }
    hairType(req, res) {
        this.getData(req, res, queries.hairType, false)
    }
    service(req, res) {
        this.getData(req, res, queries.service, false)
    }
    businessType(req, res) {
        this.getData(req, res, queries.businessType, false)
    }

    suggest(req, res, data) {
        let insertData = `INSERT INTO suggestions(businessTypeId, serviceId,hairTypeId, ownerName, ownerContact,ownerEmail,businessEmail, businessName, businessContact, businessLocation) VALUES (${data.businessTypeId},'${data.serviceId}','${data.hairTypeId}','${data.ownerName}',${data.ownerContact},'${data.ownerEmail}','${data.businessEmail}','${data.businessName}',${data.businessContact},'${data.businessLocation}')`
        this.postData(req, res, insertData)
    }
    userCheck(req, res, data) {
        let searchQuery = `SELECT *  FROM users WHERE (email LIKE '${data.username}' OR contactNumber= '${data.username}') AND roleId=5;`
        conn.query(searchQuery, (err, data) => {
            if (err) {
                response.response(res, 404, undefined, 'error in Query', true)
            }
            if (data) {
                data.length ? response.response(res, 200, undefined, 'User exist.', false) : response.response(res, 200, undefined, 'User does not exist', false)
            }
        })
    }
    otpCheck(req, res, data) {
        let searchQuery = `SELECT *  FROM users WHERE (email LIKE '${data.username}' OR contactNumber= '${data.username}') AND roleId=5 AND otp='${data.otp}';`
        console.log({ searchQuery })
        conn.query(searchQuery, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query', true)
            }
            if (result1) {
                if (result1.length) {
                    let updateQuery = `UPDATE users SET otp = '', connection='${data.connect}' WHERE users.id = ${result1[0].id};`
                    conn.query(updateQuery, (err2, result2) => {
                        if (err2) {
                            response.response(res, 404, undefined, 'error in Query..', true)
                        }
                        if (result2) {
                            let getUserDetails = `SELECT fullName,email,contactNumber,CONCAT('${host}',profilePic) as profilePic,connection as privatekey FROM users WHERE id=${result1[0].id}`
                            conn.query(getUserDetails, (err3, result3) => {
                                if (err3) {
                                    response.response(res, 404, undefined, 'error in Query.', true)
                                }
                                if (result3.length) {
                                    response.response(res, 200, result3[0], 'logged in successfully.', false)
                                }
                            })
                        }
                    })
                } else {
                    response.response(res, 402, undefined, 'Otp is not matched.', true)
                }
            }
        })
    }

    signIn(req, res, data) {
        const checkQuery = `SELECT *  FROM users WHERE (email LIKE '${data.email}' OR contactNumber= '${data.contactNumber}') AND roleId=5;`
        conn.query(checkQuery, (err, result) => {
            if (err) {
                response.response(res, 404, undefined, 'error in Query', true)
            }
            if (result) {
                if (result.length) {
                    response.response(res, 200, undefined, 'User exist.', false)
                } else {
                    const otp = this.getRndInteger(1000, 9999)
                    let insertData = `INSERT INTO users(roleId, fullName, contactNumber, email, verifyMethod, otp) VALUES (5,'${data.name}','${data.contactNumber}','${data.email}','${parseInt(data.verifiedAt)}',${otp})`
                    sendOTP.send(data.name, data.email, otp, 1)
                    conn.query(insertData, (err1, result1) => {
                        if (err1) {
                            response.response(res, 404, undefined, 'error in Query', true)
                        }
                        if (result1) {
                            response.response(res, 200, { otp }, 'Success', false)
                        }
                    })
                }
            }
        })
    }

    logout(req, res, userToken) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${req.headers[userToken]}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query', true)
            }
            if (result1) {
                if (result1.length) {
                    let updateQuery = `UPDATE users SET otp =NULL, connection=NULL WHERE users.id = ${result1[0].id};`
                    conn.query(updateQuery, (err2, result2) => {
                        if (err2) {
                            response.response(res, 404, undefined, 'error in Query', true)
                        }
                        if (result2) {
                            response.response(res, 200, undefined, 'User logout successfully.', true)
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    sendOtp(req, res, data) {
        let searchQuery = undefined;
        if (data.typeId == 1) {
            searchQuery = `SELECT id,fullName,email  FROM users WHERE email LIKE '${data.username}' AND roleId=5 ;`
        } else {
            searchQuery = `SELECT id,fullName,contactNumber  FROM users WHERE contactNumber= '${data.username}' AND roleId=5;`
        }
        if (searchQuery) {
            conn.query(searchQuery, (err1, result1) => {
                if (err1) {
                    response.response(res, 404, undefined, 'error in Query', true)
                }
                if (result1) {
                    if (result1.length) {
                        const otp = this.getRndInteger(1000, 9999)
                        let updateQuery = `UPDATE users SET otp = '${otp}' WHERE users.id = ${result1[0].id};`
                        conn.query(updateQuery, (err2, result2) => {
                            if (err2) {
                                response.response(res, 404, undefined, 'error in Query..', true)
                            }
                            if (result2) {
                                sendOTP.send(result1[0].name, result1[0].email, otp, 1)
                                response.response(res, 200, otp, 'oTP send successfully.', true)
                            }
                        })
                    } else {
                        response.response(res, 402, undefined, 'user not found.', true)
                    }
                }
            })
        } else {
            response.response(res, 402, undefined, 'error.', true)
        }
    }

    userProfile(req, res, data) {
        const requestUser = `SELECT id,fullName,email,contactNumber,CONCAT('${host}',profilePic) as profilePic FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query', true)
            }
            if (result1) {
                if (result1.length) {
                    let userNameProfile = result1[0].fullName.split(' ');
                    if (!result1[0].profilePic) {
                        let userNameProfilePic = undefined;
                        if (userNameProfile >= 2) {
                            userNameProfilePic = userNameProfile[0][0].toUpperCase() + userNameProfile[1][0].toUpperCase()
                        } else {
                            userNameProfilePic = userNameProfile[0][0].toUpperCase() + userNameProfile[0][1].toUpperCase()
                        }
                        result1[0].userNameProfilePic = userNameProfilePic
                    }
                    let userHairType = `SELECT hairtype_categories.id,hairtype_categories.name,hairtype_categories.description,concat('${host}',hairtype_categories.logo) as logo FROM user_detail INNER JOIN hairtype_categories ON user_detail.preferredId=hairtype_categories.id WHERE userId=${result1[0].id} AND preferredType=1;`
                    conn.query(userHairType, (err2, result2) => {
                        if (err2) {
                            response.response(res, 404, undefined, 'error in Query', true)
                        }
                        if (result2) {
                            let userService = `SELECT service_categoryies.id,service_categoryies.name,service_categoryies.description,concat('${host}',service_categoryies.logo) as logo FROM user_detail INNER JOIN service_categoryies ON user_detail.preferredId=service_categoryies.id WHERE userId=${result1[0].id} AND preferredType=2`
                            conn.query(userService, (err3, result3) => {
                                if (err3) {
                                    response.response(res, 404, undefined, 'error in Query', true)
                                }
                                if (result3) {
                                    response.response(res, 200, { userData: result1[0], hairType: result2, service: result3 }, 'SuccessFully.', false)
                                }
                            })
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }
    userOnboarding(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const userUpdate = `UPDATE users SET longitude='[value-13]',latitude='[value-14]' WHERE id=${result1[0].id}`
                    conn.query(userUpdate, (err2, result2) => {
                        if (err2) {
                            response.response(res, 404, undefined, 'error in Query.', true)
                        }
                        if (result2) {
                            const hairType = data.hairTypeIds.split(',')
                            const service = data.serviceIds.split(',')
                            conn.query(`DELETE FROM user_detail WHERE userId=${result1[0].id}`, (err3, result3) => {
                                if (err3) {
                                    response.response(res, 404, undefined, 'error in Query.', true)
                                }
                                if (result3) {
                                    hairType.map((e) => {
                                        if (e) {
                                            const hairType = `INSERT INTO user_detail(userId, preferredType, preferredId) VALUES (${result1[0].id},1,'${e}')`
                                            conn.query(hairType, (err4, result4) => {
                                                if (err4) {
                                                    response.response(res, 404, undefined, 'error in Query.', true)
                                                }
                                                if (result4) {

                                                }
                                            })
                                        }
                                    })
                                    service.map((e) => {
                                        if (e) {
                                            const service = `INSERT INTO user_detail(userId, preferredType, preferredId) VALUES (${result1[0].id},2,'${e}')`
                                            conn.query(service, (err5, result5) => {
                                                if (err5) {
                                                    response.response(res, 404, undefined, 'error in Query.', true)
                                                }
                                                if (result5) {

                                                }
                                            })
                                        }
                                    })
                                    response.response(res, 200, undefined, 'success', false)
                                }
                            })
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }

    preferred(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const preferredId = data.preferredId.split(',')
                    preferredId.map((e, i) => {
                        const checkQuery = `SELECT * FROM user_detail WHERE userId=${result1[0].id} AND preferredType=${data.preferredType} AND preferredId=${e}`;
                        conn.query(checkQuery, (err2, result2) => {
                            if (err2) {
                                response.response(res, 404, undefined, 'error in Query..', true)
                            }
                            if (result2) {
                                let query = undefined;
                                if (result2.length) {
                                    query = `DELETE FROM user_detail WHERE id=${result2[0].id}`
                                } else {
                                    query = `INSERT INTO user_detail(userId, preferredType, preferredId) VALUES (${result1[0].id},${data.preferredType},${e})`
                                }
                                conn.query(query, (err3, result3) => {
                                    if (err3) {
                                        response.response(res, 404, undefined, 'error in Query...', true)
                                    }
                                    if (result3) {
                                        if ((i + 1) == preferredId.length) {
                                            response.response(res, 200, undefined, 'SuccessFully.', false)
                                        }
                                    }
                                })
                            }
                        })
                    })
                    return;
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }
    wishlist(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const checkQuery = `SELECT * FROM user_salon_wishlist WHERE userId=${result1[0].id} AND businesstypeId=${data.businesstypeId} AND businessId=${data.businessId}`;
                    conn.query(checkQuery, (err2, result2) => {
                        if (err2) {
                            response.response(res, 404, undefined, 'error in Query..', true)
                        }
                        if (result2) {
                            let query = undefined;
                            if (result2.length) {
                                query = `DELETE FROM user_salon_wishlist WHERE id=${result2[0].id}`
                            } else {
                                query = `INSERT INTO user_salon_wishlist(userId, businesstypeId, businessId) VALUES (${result1[0].id},${data.businesstypeId},${data.businessId})`
                            }
                            conn.query(query, (err3, result3) => {
                                if (err3) {
                                    response.response(res, 404, undefined, 'error in Query...', true)
                                }
                                if (result3) {
                                    response.response(res, 200, undefined, 'SuccessFully.', false)
                                }
                            })
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }

    editProfile(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    let editUser = undefined;
                    if (data.profilePic) {
                        editUser = `UPDATE users SET fullName='${data.fullName}',email='${data.email}',contactNumber='${data.contactNumber}',profilePic='${data.profilePic}' WHERE id=${result1[0].id}`
                    } else {
                        editUser = `UPDATE users SET fullName='${data.fullName}',email='${data.email}',contactNumber='${data.contactNumber}' WHERE id=${result1[0].id}`
                        this.postData(req, res, editUser);
                    }
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }

    //salon list
    //under construction
    userBusinessList(req, res, data) {
        const requestUser = `SELECT id,longitude,latitude FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                console.log(result1[0]);
                const userPreference = `SELECT * FROM user_detail WHERE userId=${result1[0].id}`
                conn.query(userPreference, (err2, result2) => {
                    if (err2) {
                        response.response(res, 404, undefined, 'error in Query.', true)
                    }
                    if (result2.length) {
                        let hairTypes = '';
                        let services = '';
                        result2.map((e) => {
                            if (e.preferredType == 1) {
                                if (hairTypes == '') {
                                    hairTypes += e.preferredId;
                                } else {
                                    hairTypes += ',' + e.preferredId;
                                }
                            }
                            if (e.preferredType == 2) {
                                if (services == '') {
                                    services += e.preferredId;
                                } else {
                                    services += ',' + e.preferredId;
                                }
                            }
                        })
                        const getBuissnessId = `(SELECT businessId  FROM businesscategories WHERE categoryId IN (${hairTypes}) AND categoryType=1) UNION (SELECT businessId  FROM businesscategories WHERE categoryId IN (${services}) AND categoryType=2);`
                        conn.query(getBuissnessId, (err3, result3) => {
                            if (err3) {
                                response.response(res, 404, undefined, 'error in Query.....', true)
                            }
                            if (result3) {
                                if (result3.length) {
                                    let businessId = [];
                                    result3.map((e) => businessId.push(e.businessId))
                                    const userWishList = `SELECT id FROM user_salon_wishlist WHERE userId=${result1[0].id}`
                                    conn.query(userWishList,(err4,res4)=>{
                                        if(err4){
response.response(res, 404, undefined, 'error in Query.....', true)
                                        }
                                        if(res4){
                                    const getBuissness = `select business.id,business.name,CONCAT('${host}',business.logo) as logo,business.verifyStatus,business.rating,addresses.addressfield1,addresses.addressfield2,addresses.addressfield3,addresses.addressfield4,addresses.addressfield5,addresses.addressfield6,addresses.addressfield7,countries.name as addressfield8,salon_openings.mon,salon_openings.tues,salon_openings.wed,salon_openings.thus,salon_openings.fri,salon_openings.sat,salon_openings.sun FROM business INNER JOIN addresses ON business.userId=addresses.userId AND addresses.type=2 INNER JOIN countries ON addresses.addressfield8=countries.id INNER JOIN salon_openings ON business.id=salon_openings.salonId WHERE (((acos(sin((${data.latitude}*pi()/180)) * sin((business.latitude*pi()/180)) + cos((${data.latitude}*pi()/180)) * cos((business.latitude*pi()/180)) * cos(((${data.longitude}- business.longitude)*pi()/180)))) * 180/pi()) * 60 * 1.1515) <= ${data.distance} AND business.id IN (${businessId});`
                                    console.log({ getBuissness })
                                    this.getData(req, res, getBuissness, false,res4)
                                }
                            })
                                } else {
                                    response.response(res, 404, undefined, 'Data not found.', true)
                                }
                            }
                        })
                    } else {
                        response.response(res, 404, undefined, 'User data no found.', true)
                    }
                })
            } else {
                response.response(res, 200, undefined, 'User session expired.', true)
            }
        })
    }
    businessList(req, res, data) {
        let hairTypes = ''
        let services = ''
        const hairType1 = data.hairTypes.split('[')
        const hairType2 = hairType1[1].split(']')
        const hairType = hairType2[0].split(',')
        const service1 = data.services.split('[')
        const service2 = service1[1].split(']')
        const service = service2[0].split(',')
        hairType.map((e) => {
            if (hairTypes == '') {
                hairTypes += e
            } else {
                hairTypes += ',' + e
            }
        })
        service.map((e) => {
            if (services == '') {
                services += e
            } else {
                services += ',' + e
            }
        })
        const getBuissnessId = `(SELECT businessId  FROM businesscategories WHERE categoryId IN (${hairTypes}) AND categoryType=1) UNION (SELECT businessId  FROM businesscategories WHERE categoryId IN (${services}) AND categoryType=2);`
        conn.query(getBuissnessId, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    let businessId = [];
                    result1.map((e) => businessId.push(e.businessId))
                    let wishlist = undefined;
                    if(data.token){
                    const userWishList = `SELECT user_salon_wishlist.businessId FROM user_salon_wishlist INNER JOIN users ON user_salon_wishlist.userId=users.id WHERE users.connection='${data.token}'`
                                    conn.query(userWishList,(err4,res4)=>{
                                        if(err4){
response.response(res, 404, undefined, 'error in Query.....', true)
                                        }
                                        if(res4){
                                            console.log({userWishList,res4})
                                            wishlist = res4
                                        }
                                    })
                                }
                                console.log({wishlist})
                    const getBuissness = `select business.id,business.name,CONCAT('${host}',business.logo) as logo,business.verifyStatus,business.rating,addresses.addressfield1,addresses.addressfield2,addresses.addressfield3,addresses.addressfield4,addresses.addressfield5,addresses.addressfield6,addresses.addressfield7,countries.name as addressfield8,salon_openings.mon,salon_openings.tues,salon_openings.wed,salon_openings.thus,salon_openings.fri,salon_openings.sat,salon_openings.sun FROM business INNER JOIN addresses ON business.userId=addresses.userId AND addresses.type=2 INNER JOIN countries ON addresses.addressfield8=countries.id INNER JOIN salon_openings ON business.id=salon_openings.salonId WHERE (((acos(sin((${data.latitude}*pi()/180)) * sin((business.latitude*pi()/180)) + cos((${data.latitude}*pi()/180)) * cos((business.latitude*pi()/180)) * cos(((${data.longitude}- business.longitude)*pi()/180)))) * 180/pi()) * 60 * 1.1515) <= ${data.distance} AND business.id IN (${businessId});`
                    this.getData(req, res, getBuissness, false,wishlist)
                } else {
                    response.response(res, 404, undefined, 'Data not found.', true)
                }
            }
        })
    }
    businessDetail(req, res, data) {
        const businessDetails = `SELECT business.id,business.name,CONCAT('${host}',business.logo) as logo,business.contactNumber,business.verifyStatus,business.rating,business.description1,business.description2,business.latitude,business.longitude,addresses.addressfield1,addresses.addressfield2,addresses.addressfield3,addresses.addressfield4,addresses.addressfield5,addresses.addressfield6,addresses.addressfield7, countries.name as addressfield8,COUNT(businessuserreviews.id) as totalReview,salon_openings.mon,salon_openings.tues,salon_openings.wed,salon_openings.thus,salon_openings.fri,salon_openings.sat,salon_openings.sun FROM business LEFT JOIN businessuserreviews ON business.id=businessuserreviews.id INNER JOIN salon_openings ON business.id=salon_openings.salonId INNER JOIN addresses ON business.userId=addresses.userId INNER JOIN countries ON addresses.addressfield8=countries.id AND addresses.type=2 WHERE business.id=${data.businessId}`
        conn.query(businessDetails, (err1, result1) => {
            if (err1) {
                response.response(res, 401, undefined, 'Error i Query', true);
            }
            if (result1.length) {
                const businessService = `SELECT id,name,rating,price,time,description1,description2 FROM businessservices WHERE businessId=${data.businessId}`;
                conn.query(businessService, (err2, result2) => {
                    if (err2) {
                        response.response(res, 401, undefined, 'Error i Query', true);
                    }
                    if (result2) {
                        response.response(res, 200, { businessDetails: result1[0], businessService: result2 }, 'Success', false);
                    }
                })
            } else {
                response.response(res, 401, undefined, 'Business not found', true);
            }
        })
    }

    userWishlist(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const userWishlistQuery = `SELECT business.id,business.name,concat('${host}',business.logo) as logo,business.verifyStatus,business.rating,salon_openings.mon,salon_openings.tues,salon_openings.wed,salon_openings.thus,salon_openings.fri,salon_openings.sat,salon_openings.sun FROM user_salon_wishlist INNER JOIN business ON user_salon_wishlist.businessId=business.id INNER JOIN salon_openings ON business.id=salon_openings.salonId WHERE user_salon_wishlist.userId=${result1[0].id} AND user_salon_wishlist.businesstypeId=1;`
                    this.getData(req, res, userWishlistQuery);
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }
    businessReviews(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const business = `SELECT id,name,concat('${host}',logo) as logo FROM business WHERE 1`
                    conn.query(business,(err,res1)=>{
                        if(err){
                            response.response(res, 404, undefined, 'error in Query.', true)
                        }
                        if(res1.length){
                            let businessService = `SELECT id,name  FROM businessservices WHERE businessId =${data.businessId}`
                            conn.query(businessService, (err2, res2)=>{
                                if(err2){
                                    console.log(err2)
                                }
                                if(res2){
                                    const allReview = `SELECT businessuserreviews.id,businessuserreviews.businessserviceId,businessuserreviews.userId,concat('${host}',users.profilePic) as logo,businessuserreviews.rating,businessuserreviews.review,users.fullName,businessservices.name,businessuserreviews.created_at FROM businessuserreviews INNER JOIN businessservices ON businessuserreviews.businessServiceId=businessservices.id INNER JOIN users ON users.id=businessuserreviews.userId WHERE businessuserreviews.businessId=${data.businessId} ORDER BY businessuserreviews.id DESC`;
                            this.getData(req, res, allReview, false, {businessDetails:res1[0],businessService:res2})
                                }
                            })
                        }else{
                            response.response(res, 200, undefined, 'Business not found.', true)
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }
    changeProfilePic(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const allReview = `UPDATE users SET profilePic='${data.logo}' WHERE id=${result1[0].id}`;
                    this.postData(req, res, allReview, false)
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }

    writeReview(req, res, data) {
        const requestUser = `SELECT id FROM users WHERE connection LIKE '${data.token}'`
        conn.query(requestUser, (err1, result1) => {
            if (err1) {
                response.response(res, 404, undefined, 'error in Query.', true)
            }
            if (result1) {
                if (result1.length) {
                    const getBusinessReview = `SELECT id,totalRating,ratingUserCount FROM business WHERE id=${data.businessId}`
                    conn.query(getBusinessReview, (err2, result2) => {
                        if (err2) {
                            response.response(res, 401, undefined, 'Error i Query', true);
                        }
                        if (result2.length) {
                            let businessTotalRating = parseFloat(result2[0].totalRating);
                            let userRating = parseInt(data.rating);
                            let businessRatingUserCount = parseInt(result2[0].ratingUserCount);
                            const updateReview = `UPDATE business SET rating='${parseFloat((businessTotalRating + userRating) / (businessRatingUserCount + 1))}',totalRating='${businessTotalRating + userRating}',ratingUserCount='${businessRatingUserCount + 1}' WHERE id=3`
                            conn.query(updateReview, (err3, result3) => {
                                if (err3) {
                                    response.response(res, 401, undefined, 'Error i Query', true);
                                }
                                if (result3) {
                                    let writeQuery = undefined;
                                    if (data.review) {
                                        writeQuery = `INSERT INTO businessuserreviews( businessType, businessId, userId, rating, review,businessServiceId) VALUES ('${data.businessTypeId}','${data.businessId}','${result1[0].id}','${data.rating}','${data.review}','${data.businessServiceId}')`
                                    } else {
                                        writeQuery = `INSERT INTO businessuserreviews( businessType, businessId, userId, rating,businessServiceId) VALUES ('${data.businessTypeId}','${data.businessId}','${result1[0].id}','${data.rating}','${data.businessServiceId}')`
                                    }
                                    this.postData(req, res, writeQuery);
                                }
                            })
                        } else {
                            response.response(res, 404, undefined, 'Business Not found', true);
                        }
                    })
                } else {
                    response.response(res, 200, undefined, 'User session expired.', true)
                }
            }
        })
    }

    getData(req, res, query, first,baisData) {
        conn.query(query, (err, data) => {
            if (err) {
                console.log({err})
                res.send({ status: 402, data: undefined, message: 'error in Query', error: err });
            }
            if (data.length) {
                first ? response.response(res, 200, {data:data[0],baisData}, 'success', false)
                    :
                    response.response(res, 200, {data,baisData}, 'success', false)
            } else {
                response.response(res, 404, undefined, 'Data not found', true)
            }
        })
    }

    postData(req, res, query) {
        conn.query(query, (err, data) => {
            if (err) {
                response.response(res, 200, undefined, 'error in Query', err)
            }
            if (data) {
                response.response(res, 200, undefined, 'success', false)
            }
        })
    }
}

module.exports = onBoarding;