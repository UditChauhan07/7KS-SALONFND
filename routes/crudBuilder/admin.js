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
var name = "admin";
let handler = 'http://';
title = "Salon-Finder";

router.get("/", (req, res) => {
  const asset = handler+req.headers.host;
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
    let index = 2;
    let htmltable = "user";
    let query = queries.multi(operation, insertedTable, null, index);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        let tStatus = tablestatus.draw(htmltable);
        const getStatus = leftMenuSuppy.get({change:'admin',childEffect:{name:'view'}});
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
        res.render("admin/index", {
          moduleName: name,
          title: name + " List | " + title,
          successCode: code,
          message: msg,
          tableData: newResult[listIndex],
          tableStatus: tStatus,
          data: AuthData,
          url:getStatus,
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
  const asset = handler+req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }

    let index = 2;
    let htmltable = "user";
    let countries = queries.countriesIndex();
    conn.query(countries,(err, country)=>
    {
      if(err){
        console.log(err);
      }
      if(country){
        let tStatus = tablestatus.draw(htmltable);
        const getStatus = leftMenuSuppy.get({change:'admin',childEffect:{name:'create'}});
        res.render("admin/create", {
          moduleName: name,
          title: name + " List | " + title,
          tableStatus: tStatus,
          data: AuthData,
          countries:country,
          url:getStatus,
          asset,
        });

      }
    })
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/create", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.create) {
      let roleId = 2;
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      } else {
        if (req.body.password != req.body.password1) {
          req.session.falg = 404;
          res.redirect("/create/" + name);
          return;
        }
        var hashPassword = bcrypt.hashSync(req.body.password, 10);
        const userData = {
          roleId: roleId,
          fullName: req.body.fullName,
          email: req.body.email,
          contactNumber: req.body.contactNumber,
          password: hashPassword,
          isEnabled: req.body.isEnabled || 0,
        };

        const createUser = queries.create(table.user, userData);
        const checkUserUnique = queries.isExisted({
          contact: req.body.contactNumber,
          email: req.body.email,
        });
        conn.query(checkUserUnique, (err1, user) => {
          if (err1) {
            console.log(err1);
            req.session.flag = "iURL";
            res.redirect("/");
            return;
          }
          if (user.length == 0) {
            conn.query(createUser, (err2, result) => {
              if (err2) {
                console.log(err2);
                req.session.flag = "iURL";
                res.redirect("/");
                return;
              }
              if (result) {
                const userAddress = {
                  type: 1,
                  addressfield1: req.body.address,
                  addressfield2: req.body.city,
                  addressfield3: req.body.state,
                  addressfield4: req.body.zipCode,
                  addressfield5: req.body.country,
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
                    res.redirect("/");
                    return;
                  }
                  if (result) {
                    req.session.flg = false;
                    req.session.flag = 200;
                    res.redirect("/admin");
                  }
                });
              }
            });
          } else {
            res.redirect("/admin/create");
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
  const asset = handler+req.headers.host;
  if (req.session.data) {
    console.log("uoooooooooooo");
    const AuthData = req.session.data;
    var id = req.params.id;
    const sqDb = queries.oneUserAddressIndex(id);
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let index = 2;
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
        conn.query(countries,(err, country)=>
        {
          if(err){
            console.log(err);
          }
          if(country){
            res.render("admin/edit", {
              moduleName: name,
              title: name + " List | " + title,
              tableStatus: tStatus,
              data: AuthData,
              countries:country,
              editData: editUser[0],
              asset,
            });
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
  const asset = handler+req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.edit) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.oneUserAddressIndex(id);
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      conn.query(sqDb, (err, editUser) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (editUser.length) {
          const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            contactNumber: req.body.contactNumber,
            isEnabled: req.body.isEnabled || 0,
            where: { id: id },
          };
          const userEditAddress = {
            addressfield1: req.body.address,
            addressfield2: req.body.city,
            addressfield3: req.body.state,
            addressfield4: req.body.zipCode,
            addressfield5: req.body.country,
            where: { userId: id },
          };
          const userCreateAddress = {
            userId:id,
            addressfield1: req.body.address,
            addressfield2: req.body.city,
            addressfield3: req.body.state,
            addressfield4: req.body.zipCode,
            addressfield5: req.body.country,
          };
          const updateUser = queries.edit(table.user, userData);
          const getUserAddress = queries.oneAddressIndex(id);
          const updateUserAddress = queries.edit(table.address, userEditAddress);
          const createUserAddress = queries.create(table.address,userCreateAddress);
          conn.query(updateUser, (err2, result) => {
            if (err2) {
              console.log(err2);
              req.session.flag = "iURL";
              res.redirect("/");
              return;
            }
            if (result) {
              conn.query(getUserAddress, (err, uAdd) => {
                if (err) {
                  console.log(err);
                  req.session.flag = "iURL";
                  res.redirect("/");
                }
                if (uAdd.length) {
                  conn.query(updateUserAddress, (err, upres) => {
                    if (err) {
                      console.log(err);
                      req.session.flag = "iURL";
                      res.redirect("/");
                    }
                    if (upres) {
                      req.session.flag = 200;
                      res.redirect("/admin");
                    }
                  });
                } else {
                  conn.query(createUserAddress, (err, cA) => {
                    if (err) {
                      console.log(err);
                      req.session.flag = "iURL";
                      res.redirect("/");
                    }
                    if (cA) {
                      req.session.flag = 200;
                      res.redirect("/admin");
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

router.get('/:id/delete',(req,res)=>{
  const asset = handler+req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.delete) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.oneUserAddressDelete(id);
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      console.log({sqDb});
      conn.query(sqDb, (err, result) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (result) {
          req.session.flag = 200;
                      res.redirect("/admin");
        }
      });
    } else {
      notAuth(req, res);
    }
  } else {
    permissionDenied(req, res);
  }
  return;
})

function notAuth(req, res) {
  req.session.flag = 5;
  res.redirect("/");
}

function permissionDenied(req, res) {
  req.session.flag = "PD";
  res.redirect("/");
}
module.exports = router;
