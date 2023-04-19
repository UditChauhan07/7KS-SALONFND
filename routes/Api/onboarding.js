var express = require("express");
var multer = require('multer')
var router = express.Router();
var onboardingQuery = require("../../database/Api/onboarding");
let query = new onboardingQuery();
const Response = require("../../service/api/response");
const response = new Response();
const xHeaderCheck = ['root', 'Ow8lEMVpIgkKTdx4GbJC1UPUp-3WONJtCivf0PFmf0qYj6DbdEI'];
var multer = require('multer');
var upload = multer();
router.use(upload.array());

const token = 'secretkey';
const userToken = 'privatekey';



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/public/')
    },
    filename: function (req, file, cb) {
        cb(null, "profilePic")
    }
})

var upload = multer({
    storage: storage,
})

// router.post("/profilePic" , function (req, res) {
//     console.log(req.body);
//     res.send({data:req.body})
// });

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
let session = undefined

router.get('/', (req, res) => {
    session = makeid(25);
    response.response(res, 200, makeid(25) + '-' + session + '-' + makeid(25), 'success', false)
})

router.post('/h3JcHmQ5U4mKm3WlQl2eFNaEA', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.slug != "") {
                if (req.body.slug == "1") {
                    query.splashScreen(req, res);
                } else if (req.body.slug == "2") {
                    query.hairType(req, res);
                } else if (req.body.slug == "3") {
                    query.service(req, res);
                } else if (req.body.slug == "4") {
                    query.businessType(req, res);
                } else {
                    response.response(res, 200, undefined, 'invalid Slug', true)
                }
            } else {
                response.response(res, 404, undefined, 'invalid request paramter', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/8wJgAm1azWRlPIqDLEHPXcxGw', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.username) {
                const data = { username: req.body.username }
                query.userCheck(req, res, data);
            } else {
                response.response(res, 404, undefined, 'Invalid Parameter request.', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/lVFUtZbAjQg8SkzBJjSzvatvm', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.email && req.body.contactNumber && req.body.name && req.body.verifiedAt) {
                const data = { email: req.body.email, contactNumber: req.body.contactNumber, name: req.body.name, verifiedAt: req.body.verifiedAt }
                query.signIn(req, res, data);
            } else {
                if (!req.body.name) {
                    response.response(res, 404, undefined, 'Name filed is required', true)
                } else if (!req.body.email) {
                    response.response(res, 404, undefined, 'Email filed is required', true)
                }
                else if (!req.body.contactNumber) {
                    response.response(res, 404, undefined, 'Contact Number filed is required', true)
                } else if (!req.body.verifiedAt) {
                    response.response(res, 404, undefined, 'Verification At filed is required', true)
                }
                else {
                    response.response(res, 404, undefined, 'missing required parameter', true)
                }
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/mRCgy9TLlAfX5k8TOOoC25CuO', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.businessTypeId && req.body.serviceId && req.body.ownerName && req.body.ownerContact && req.body.businessName && req.body.businessContact && req.body.businessLocation && req.body.hairTypeId && req.body.businessEmail && req.body.ownerEmail) {
                const data = { businessTypeId: req.body.businessTypeId, serviceId: req.body.serviceId, ownerName: req.body.ownerName, ownerContact: req.body.ownerContact, businessName: req.body.businessName, businessContact: req.body.businessContact, businessLocation: req.body.businessLocation,hairTypeId:req.body.hairTypeId,ownerEmail:req.body.ownerEmail,businessEmail:req.body.businessEmail }
                query.suggest(req, res, data);
            } else {
                if (!req.body.ownerName) {
                    response.response(res, 404, undefined, 'Owner Name filed is required', true)
                } else if (!req.body.businessTypeId) {
                    response.response(res, 404, undefined, 'Business Id is required', true)
                }
                else if (!req.body.businessEmail) {
                    response.response(res, 404, undefined, 'Business Email Id filed is required', true)
                }else if (!req.body.ownerEmail) {
                    response.response(res, 404, undefined, 'Owner Email is required', true)
                }
                else if (!req.body.hairTypeId) {
                    response.response(res, 404, undefined, 'Hair Type Id filed is required', true)
                }
                else if (!req.body.serviceId) {
                    response.response(res, 404, undefined, 'Service Id filed is required', true)
                } else if (!req.body.ownerContact) {
                    response.response(res, 404, undefined, 'Owner Contact Number filed is required', true)
                }
                else if (!req.body.businessName) {
                    response.response(res, 404, undefined, 'Business Name filed is required', true)
                }
                else if (!req.body.businessContact) {
                    response.response(res, 404, undefined, 'Business Contact filed is required', true)
                }
                else if (!req.body.businessLocation) {
                    response.response(res, 404, undefined, 'Business Location filed is required', true)
                }
                else {
                    response.response(res, 404, undefined, 'missing required parameter', true)
                }
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/QpaTZt5bRomGsOiZPIjFKixxA', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.username && req.body.otp) {
                const data = { username: req.body.username, otp: req.body.otp, connect: makeid(50) }
                query.otpCheck(req, res, data);
            } else if (!req.body.username) {
                response.response(res, 404, undefined, 'Username filed is Required.', true)
            }
            else if (!req.body.otp) {
                response.response(res, 404, undefined, 'otp filed is Reuired.', true)
            }
            else {
                response.response(res, 404, undefined, 'Invalid Parameter request.', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/NGX8PanGIbHug2Ow4AOUWCdcS', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                query.logout(req, res, userToken)
            } else {
                response.response(res, 404, undefined, 'user unauthorized')
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'Unauthorized')
    }
})

router.post('/zqvbXsuIOuXRWTga6LlAc42Ng', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.body.username && req.body.typeId) {
                const data = { username: req.body.username, typeId: req.body.typeId }
                query.sendOtp(req, res, data);
            } else {
                response.response(res, 404, undefined, 'Invalid Parameter request.', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized', true)
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized', true)
    }
})

router.post('/TP9P2PKyxiLbFyVvpGFKYRFzh', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                const data = { token: req.headers[userToken] }
                query.userProfile(req, res, data)
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized', true)
        }
    } else {
        response.response(res, 404, undefined, 'Unauthorized', true)
    }
})

router.post('/eaOseWliJHV8i1zalyBFPkaVB', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.preferredType && req.body.preferredId) {
                    const data = { token: req.headers[userToken], preferredType: req.body.preferredType, preferredId: req.body.preferredId }
                    query.preferred(req, res, data)
                } else if (!req.body.preferredType) {
                    response.response(res, 404, undefined, 'Preferred type filed is required', true)
                } else if (!req.body.preferredId) {
                    response.response(res, 404, undefined, 'Preferred id filed is required', true)
                } else {
                    response.response(res, 404, undefined, 'invaid request parameter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized', true)
        }
    } else {
        response.response(res, 404, undefined, 'Unauthorized', true)
    }
})

router.post('/IJ9k0GFHQMNsIGoLlyYffz1oG', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.businesstypeId && req.body.businessId) {
                    const data = { token: req.headers[userToken], businesstypeId: req.body.businesstypeId, businessId: req.body.businessId }
                    query.wishlist(req, res, data)
                } else if (!req.body.businesstypeId) {
                    response.response(res, 404, undefined, 'Business type filed is required', true)
                } else if (!req.body.businessId) {
                    response.response(res, 404, undefined, 'Business id filed is required', true)
                } else {
                    response.response(res, 404, undefined, 'invaid request parameter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized', true)
        }
    } else {
        response.response(res, 404, undefined, 'Unauthorized', true)
    }
})

router.post('/Ec55v2RaoWXzfqOfOezOVNbNB', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.email && req.body.contactNumber && req.body.name) {
                    const data = { token: req.headers[userToken], email: req.body.email, contactNumber: req.body.contactNumber, name: req.body.name, profilePic: req.body.profilePic }
                    query.editProfile(req, res, data);
                } else {
                    if (!req.body.name) {
                        response.response(res, 404, undefined, 'Name filed is required', true)
                    } else if (!req.body.email) {
                        response.response(res, 404, undefined, 'Email filed is required', true)
                    }
                    else if (!req.body.contactNumber) {
                        response.response(res, 404, undefined, 'Contact Number filed is required', true)
                    }
                    else {
                        response.response(res, 404, undefined, 'missing required parameter', true)
                    }
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/cs4J2oY2Ao2hE1A9hboBXMl9e', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                const data = { token: req.headers[userToken] }
                query.userWishlist(req, res, data);
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/UKQF1b50mqU3LI99oQuIcwwRE', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.businessTypeId && req.body.businessId && req.body.rating && req.body.businessServiceId) {
                    const data = { token: req.headers[userToken], businessTypeId: req.body.businessTypeId, businessId: req.body.businessId, rating: req.body.rating, review: req.body.review ,businessServiceId:req.body.businessServiceId}
                    query.writeReview(req, res, data);
                } else if (!req.body.businessTypeId) {
                    response.response(res, 401, undefined, 'Business Type ID filed required', true)
                } else if (!req.body.businessId) {
                    response.response(res, 401, undefined, 'Business Id filed required', true)
                } else if (!req.body.rating) {
                    response.response(res, 401, undefined, 'Rating field required', true)
                }
                else if (!req.body.businessServiceId) {
                    response.response(res, 401, undefined, 'business Service Id field required', true)
                }
                else {
                    response.response(res, 401, undefined, 'Invalid request paramter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

//salon details
router.post('/QT8mpvnWVoYMSwD9XjGIiTNRG', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if(req.headers[userToken]){
                if(req.body.hairTypes && req.body.services && req.body.latitude && req.body.longitude){
                    const data = { token:req.headers[userToken],hairTypes: req.body.hairTypes, services: req.body.services, latitude: req.body.latitude, longitude: req.body.longitude, distance: req.body.distance || 32 }
                    query.businessList(req, res, data)
                }else{
                    const data = { token:req.headers[userToken], distance: req.body.distance || 32 }
                    query.userBusinessList(req, res, data)
                }
            }else if (req.body.hairTypes && req.body.services && req.body.latitude && req.body.longitude) {
                const data = { hairTypes: req.body.hairTypes, services: req.body.services, latitude: req.body.latitude, longitude: req.body.longitude, distance: req.body.distance || 32 }
                query.businessList(req, res, data)
            } else if (!req.body.hairTypes) {
                response.response(res, 401, undefined, 'hairTypes filed required', true)
            } else if (!req.body.services) {
                response.response(res, 401, undefined, 'services filed required', true)
            } else if (!req.body.latitude) {
                response.response(res, 401, undefined, 'latitude field required', true)
            } else if (!req.body.longitude) {
                response.response(res, 401, undefined, 'longitude field required', true)
            } else {
                response.response(res, 401, undefined, 'Invalid request paramter', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/bIBASEEJPPLOtXruGNEg3kbiG', (req, res) => {
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.businessId) {
                    const data = { token: req.headers[userToken], businessId: req.body.businessId }
                    query.businessDetail(req, res, data);
                } else if (!req.body.businessId) {
                    response.response(res, 401, undefined, 'Business Id filed required', true)
                } else {
                    response.response(res, 401, undefined, 'Invalid request paramter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/0xeWZOEYmow98P2EFKQgPkfLQ',(req,res)=>{
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.businessId) {
                    const data = { token: req.headers[userToken], businessId: req.body.businessId }
                    query.businessReviews(req, res, data);
                } else if (!req.body.businessId) {
                    response.response(res, 401, undefined, 'Business Id filed required', true)
                } else {
                    response.response(res, 401, undefined, 'Invalid request paramter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

router.post('/QFvKAWPG4tpsHxPpkJqeyPEqM',(req,res)=>{
    if (req.headers[token]) {
        if (xHeaderCheck.includes(req.headers[token])) {
            if (req.headers[userToken]) {
                if (req.body.hairTypeIds && req.body.serviceIds && req.body.longitude && req.body.latitude) {
                    const data = { token: req.headers[userToken], hairTypeIds: req.body.hairTypeIds,serviceIds:req.body.serviceIds,longitude:req.body.longitude,latitude:req.body.latitude }
                    query.userOnboarding(req, res, data);
                } else if (!req.body.hairTypeIds) {
                    response.response(res, 401, undefined, 'Hair Type Ids filed required', true)
                }else if (!req.body.serviceIds) {
                    response.response(res, 401, undefined, 'Service Ids filed required', true)
                }else if (!req.body.longitude) {
                    response.response(res, 401, undefined, 'longitude Id filed required', true)
                }else if (!req.body.latitude) {
                    response.response(res, 401, undefined, 'latitude Id filed required', true)
                } else {
                    response.response(res, 401, undefined, 'Invalid request paramter', true)
                }
            } else {
                response.response(res, 404, undefined, 'user unauthorized', true)
            }
        } else {
            response.response(res, 404, undefined, 'unauthorized')
        }
    } else {
        response.response(res, 404, undefined, 'unauthorized')
    }
})

module.exports = router;