var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var bcrypt = require("bcrypt");
var conn = require("../../database/conn");
let Query = require("../../database/query");
let Table = require("../../database/lib/table");
let Operation = require("../../database/lib/operation");
let TableStatus = require("../../service/html/tableStatus");
const LeftStatus = require("../../service/html/leftStatus");
const leftMenuSuppy = new LeftStatus();
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const tablestatus = new TableStatus();
const table = tableSupply.focus();
const operations = operationSupply.focus();
var name = "salon";
let handler = "http://";
title = "Salon-Finder";

router.get("/", (req, res) => {
  const asset = handler + req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let code = false;
    let msg = "";
    if (req.session.flag) {
      if (req.session.flag == process.env.ModuleCreateCode) {
        msg = name + " Created Successfully";
      }
      if (req.session.flag == process.env.ModuleUpdateCode) {
        msg = name + " Updated Successfully";
      }
      if (req.session.flag == process.env.ModuleDeleteCode) {
        msg = name + " Deleted Successfully";
      }
    }
    let listIndex = 0;
    if (req.session.listIndex) {
      listIndex = req.session.listIndex;
    }
    let insertedTable = table[name];
    let operation = operations.index;
    let index = 3;
    let query = queries.multi(operation, insertedTable, null, index);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        const getStatus = leftMenuSuppy.get({
          change: "salon",
          childEffect: { name: "view" },
        });
        const chunkSize = 10;
        const newResult = [];
        for (let i = 0; i < result.length; i += chunkSize) {
          const chunk = result.slice(i, i + chunkSize);
          newResult.push(chunk);
        }
        let paginateData = Object.keys(newResult);
        let paginateArray = [];
        paginateData.forEach(element => {
          paginateArray.push({key:(parseInt(element)+1)})
        });
        let paginate ={
          first:1,
          last:paginateData.length,
          array:paginateArray
        }
        res.render("salon/index", {
          moduleName: name,
          title: name + " Create | " + title,
          successCode: code,
          message: msg,
          tableData: newResult[listIndex],
          url: getStatus,
          data: AuthData,
          asset,paginate
        });
      }
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.get("/create", (req, res) => {
  const asset = handler + req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let countries = queries.countriesIndex();
    conn.query(countries, (err, country) => {
      if (err) {
        console.log(err);
      }
      if (country) {
        const getStatus = leftMenuSuppy.get({
          change: "salon",
          childEffect: { name: "create" },
        });
        let hairType = queries.hairtypecategoriesList();
        conn.query(hairType,(err1,result1)=>{
          if(err1){
            console.log(err1)
          }
          if(result1){
            let service = queries.serviceCategoryiesIndex();
            conn.query(service,(err2,result2)=>{
              if(err2){
                console.log(err2)
              }
              if(result2){
                let businessType = queries.businessType();
                conn.query(businessType,(err3,result3)=>{
                  if(err3){
                    console.log(err3)
                  }
                  if(result3){
                    res.render("salon/create", {
                      moduleName: name,
                      title: name + " List | " + title,
                      url: getStatus,
                      data: AuthData,
                      countries: country,
                      barber:result2,
                      stylist:result1,
                      businessType:result3,
                      asset,
                    });
                  }
                })
              }
            })
          }
        })
      }
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/create", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.create) {
      let roleId = 4;
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({ status: false });
        return;
      } else {
        var hashPassword = bcrypt.hashSync(req.body.userPassword, 10);
        const userData = {
          roleId: 4,
          fullName: req.body.userName,
          email: req.body.userEmail,
          contactNumber: req.body.userPhone,
          password: hashPassword,
          isEnabled: req.body.salonStatus || 0,
          longitude:req.body.longitute,
          latitude:req.body.latitute,
        };
        const createUser = queries.create(table.user, userData);
        console.log({createUser},req.body.longitute)
        const checkUserUnique = queries.isExisted({
          contact: req.body.userPhone,
          email: req.body.userEmail,
        });
        conn.query(checkUserUnique, (err1, user) => {
          if (err1) {
            console.log(err1);
            req.session.flag = "iURL";
            // res.redirect("/");
            res.send({ status: false });
            return;
          }
          if (user.length == 0) {
            conn.query(createUser, (err2, result) => {
              if (err2) {
                console.log(err2);
                req.session.flag = "iURL";
                // res.redirect("/");
                res.send({ status: false });
                return;
              }
              if (result) {
                const businessData = {
                  name: req.body.salonName,
                  businesstypeId:req.body.businesstypeId,
                  email: req.body.salonEmail,
                  contactNumber: req.body.salonPhone,
                  alternateNumber: req.body.salonAPhone,
                  verifyStatus: req.body.salonVerifed,
                  createdBy: req.session.data.id,
                  isEnabled: req.body.salonStatus || 0,
                  userId: result.insertId,
                  longitude:req.body.longitute,
                  latitude:req.body.latitute,
                };
                const userAddress = {
                  type: 2,
                  addressfield1: req.body.salonAddress,
                  addressfield2: req.body.salonCity,
                  addressfield3: req.body.salonState,
                  addressfield4: req.body.salonZipCode,
                  addressfield8: req.body.salonCountry,
                  userId: result.insertId,
                };
                const createUserAddress = queries.create(
                  table.address,
                  userAddress
                );
                conn.query(createUserAddress, (err3, result) => {
                  if (err3) {
                    console.log(err3);
                    req.session.flag = "iURL";
                    req.session.flg = false;
                    // res.redirect("/");
                  }
                  if (result) {
                    const createBusinessAddress = queries.create(
                      table.salon,
                      businessData
                    );
                    console.log({createBusinessAddress,businessData})
                    conn.query(createBusinessAddress, (err4, res4) => {
                      if (err4) {
                        console.log(err4);
                      }
                      if (res4) {
                        let mon = 'Closed';
                        let tues = 'Closed';
                        let wed = 'Closed';
                        let thus = 'Closed';
                        let fri = 'Closed';
                        let sat = 'Closed';
                        let sun = 'Closed';
                        if(req.body.salonOpening.includes('0')){ mon = req.body.salonWorking}
                        if(req.body.salonOpening.includes('1')){tues = req.body.salonWorking}
                        if(req.body.salonOpening.includes('2')){wed = req.body.salonWorking}
                        if(req.body.salonOpening.includes('3')){thus = req.body.salonWorking}
                        if(req.body.salonOpening.includes('4')){fri = req.body.salonWorking}
                        if(req.body.salonOpening.includes('5')){sat = req.body.salonWorking}
                        if(req.body.salonOpening.includes('6')){sun = req.body.salonWorking}
                        const businessOpening = `INSERT INTO salon_openings( salonId, mon, tues, wed, thus, fri, sat, sun) VALUES ('${res4.insertId}','${mon}','${tues}','${wed}','${thus}','${fri}','${sat}','${sun}')`
                        conn.query(businessOpening,(err5,result5)=>{
                          if(err5){
                            console.log(err4);
                          }
                          if(result5){
                            req.body.salonHairType.map((e)=>{
                              console.log(e)
                              const hairType = `INSERT INTO businesscategories( businessId, categoryType, categoryId, createdBy) VALUES ('${res4.insertId}','1','${e}','${req.session.data.id}')`;
                              conn.query(hairType,(err6, result6)=>{
                                if(err6){
                                  console.log(err6)
                                }
                              })
                            })
                            req.body.salonServices.map((e)=>{
                              const service = `INSERT INTO businesscategories( businessId, categoryType, categoryId, createdBy) VALUES ('${res4.insertId}','2','${e}','${req.session.data.id}')`;
                              conn.query(service,(err7,result7)=>{
                                if(err7){
                                  console.log(err7)
                                }
                              })
                            })
                            let businessServices = JSON.parse(req.body.businessServices);
                            if(businessServices.length){
                              businessServices.map((e)=>{
                                const serviceInsert = `INSERT INTO businessservices(businessId, createdBy, name, price, time, description1, description2) VALUES ('${res4.insertId}','${req.session.data.id}','${e.name}','${e.price}','${e.time}','${e.description1}','${e.description2}')`
                                conn.query(serviceInsert,(err8,result8)=>{
                                  if(err8){
                                    console.log(err8)
                                  }
                                })
                              })
                            }
                            req.session.flag = process.env.ModuleCreateCode;
                            req.session.businessId = res4.insertId;
                            res.send({ status: true });
                            return;
                          }
                        })
                      }
                    });
                    // res.redirect("/salon");
                  }
                });
              }
            });
          } else {
            res.send({ status: false, msg: "user already exists" });
          }
        });
      }
    } else {
      permissionDenied(req, res);
    }
  } else {
    notAuth(req, res);
  }
  return;
});

router.get("/:id", (req, res) => {
  const asset = handler + req.headers.host;
  if (req.session.data) {
    console.log("uoooooooooooo");
    const AuthData = req.session.data;
    var id = req.params.id;
    const sqDb = queries.salonEdit(id);
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let htmltable = "user";
    let tStatus = tablestatus.draw(htmltable);
    console.log("uooddddd", sqDb);
    conn.query(sqDb, (err, editUser) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      if (editUser.length) {
        let countries = queries.countriesIndex();
        conn.query(countries,(err1, res1)=>{
          if(err1){
            console.log(err1);
          }
          if(res1.length){
            const businessServiceList = queries.businessServiceList(id);
            const businessCategoriesList = queries.businessCategoriesList(id);
            let hairType = queries.hairtypecategoriesList();
            let service = queries.serviceCategoryiesIndex();
            conn.query(businessServiceList,(err2,res2)=>{
              if(err2){
                console.log(err2)
              }
              if(res2){
                conn.query(businessCategoriesList,(err3,res3)=>{
                  if(err3){
                    console.log(err3)
                  }
                  if(res3){
                    conn.query(hairType,(err4,res4)=>{
                      if(err4){
                        console.log(err4)
                      }
                      if(res4){
                        conn.query(service,(err5,res5)=>{
                          if(err5){
                            console.log(err5)
                          }
                          if(res5){
                            let businessType = queries.businessType();
                            conn.query(businessType,(err6,res6)=>{
                              if(err6){
                                console.log(err6)
                              }
                              if(res6){
                                console.log({businessData:editUser[0],businessCategories:res3,
                                  businessService:res2})
                                res.render("salon/edit", {
                                  moduleName: name,
                                  title: name + " List | " + title,
                                  tableStatus: tStatus,
                                  data: AuthData,
                                  editData: {businessData:editUser[0],businessCategories:res3,
                                    businessService:res2},
                                  basicData:{countries:res1,hairType:res4,service:res5,businessType:res6},
                                  asset,
                                });
                              }
                            })
                          }
                        })
                      }
                    })

                  }
                })
              }
            })
          }
        })
      }
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/:id", (req, res) => {
  const asset = req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.edit) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.salonEdit(id);
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({status:false})
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      conn.query(sqDb, (err, editUser) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          // res.redirect("/");
          res.send({status:false})
          return;
        }
        if (editUser.length) {
          const userData = {
            fullName: req.body.oname,
            email: req.body.oemail,
            contactNumber: req.body.ophone,
            isEnabled: req.body.isEnabled || 0,
            where: { id: editUser[0].userId },
          };
          const businessData = {
            name: req.body.fullName,
            email: req.body.email,
            contactNumber: req.body.phone,
            alternateNumber: req.body.aphone,
            verifyStatus: 1,
            isEnabled: req.body.isEnabled || 0,
            where: { userId: editUser[0].userId },
          };
          const userAddress = {
            addressfield1: req.body.address,
            addressfield2: req.body.city,
            addressfield3: req.body.state,
            addressfield4: req.body.zipCode,
            addressfield8: req.body.country,
            where: { userId: editUser[0].userId },
          };
          const updateUser = queries.edit(table.user, userData);
          const updateSalon = queries.edit(table.salon, businessData);
          const updateUserAddress = queries.edit(
            table.address,
            userAddress
          );
          conn.query(updateUser, (err2, result) => {
            if (err2) {
              console.log(err2);
              req.session.flag = "iURL";
              // res.redirect("/");
              res.send({status:false})
              return;
            }
            if (result) {
              conn.query(updateSalon, (err, uAdd) => {
                if (err) {
                  console.log(err);
                  req.session.flag = "iURL";
                  res.send({status:false})
                  // res.redirect("/");
                }
                if (uAdd) {
                  conn.query(updateUserAddress, (err, upres) => {
                    if (err) {
                      console.log(err);
                      req.session.flag = "iURL";
                      res.send({status:false})
                      // res.redirect("/");
                    }
                    if (upres) {
                      req.session.flag = 200;
                      req.session.businessId = id;
                      res.send({status:true})
                      // res.redirect("/salon");
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      notAuth(req, res);
    }
  } else {
    permissionDenied(req, res);
  }
  return;
});

router.get("/:id/delete", (req, res) => {
  const asset = req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.delete) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const index = queries.salonsIndex(id);
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      conn.query(index, (err, result) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (result.length) {
          let userid = result[0].userId;
          const sqDb1 = queries.deleteIndex(table.salon, id);
          const sqDb2 = queries.deleteIndex(table.user, userid);
          const sqDb3 = queries.userAddressDelete(userid);
          conn.query(sqDb1, (err11, res11) => {
            if (err11) {
              console.log(err11);
            }
            if (res11) {
              conn.query(sqDb2, (err12, res12) => {
                if (err12) {
                  console.log(err12);
                }
                if (res12) {
                  conn.query(sqDb3, (err13, res13) => {
                    if (err13) {
                      console.log(err13);
                    }
                    if (res13) {
                      req.session.flag = process.env.ModuleDeleteCode;
                      res.redirect("/salon");
                    }
                  });
                }
              });
            }
          });
        } else {
          req.session.flag = 404;
          res.redirect("/");
          return;
        }
      });
    } else {
      notAuth(req, res);
    }
  } else {
    permissionDenied(req, res);
  }
  return;
});

router.get("/:id/index", (req, res) => {
  const id = req.params.id;
  req.session.listIndex = (parseInt(id)-1)
  res.redirect("/salon");
});

function notAuth(req, res) {
  req.session.flag = 5;
  res.redirect("/");
}

function permissionDenied(req, res) {
  req.session.flag = "PD";
  res.redirect("/");
}
module.exports = router;
