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
var name = "user";
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
      if (req.session.flag == 200) {
        req.session.flag = false;
        code = true;
        msg = name + " Created Successfully";
      }
    }
    let insertedTable = table[name];
    let operation = operations.index;
    let index = 5;
    let htmltable = "user";
    let query = queries.multi(operation, insertedTable, null, index);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        const getStatus = leftMenuSuppy.get({change:'user',childEffect:{name:'view'}});
        let tStatus = tablestatus.draw(htmltable);
        res.render("user/index", {
          moduleName: name,
          title: name + " List | " + title,
          successCode: code,
          message: msg,
          tableData: result,
          tableStatus: tStatus,
          url:getStatus,
          data: AuthData,
          asset,
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

    let index = 5;
    let htmltable = "user";
    let tStatus = tablestatus.draw(htmltable);
    res.render("user/create", {
      moduleName: name,
      title: name + " List | " + title,
      tableStatus: tStatus,
      data: AuthData,
      asset,
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/create", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.create) {
      let roleId = 5;
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
                    res.redirect("/user");
                  }
                });
              }
            });
          } else {
            res.redirect("/user/create");
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
        console.log(editUser);
        res.render("user/edit", {
          moduleName: name,
          title: name + " List | " + title,
          tableStatus: tStatus,
          data: AuthData,
          editData: editUser[0],
          asset,
        });
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
                      res.redirect("/user");
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
                      res.redirect("/user");
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
  const asset = req.headers.host;
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
                      res.redirect("/user");
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
