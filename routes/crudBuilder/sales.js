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
const Select = require("../../service/html/select");
const select = new Select();
const leftMenuSuppy = new LeftStatus();
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const tablestatus = new TableStatus();
const table = tableSupply.focus();
const operations = operationSupply.focus();
var name = "sales";
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
    console.log({ query });
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        const chunkSize = 10;
        const newResult = [];
        for (let i = 0; i < result.length; i += chunkSize) {
          const chunk = result.slice(i, i + chunkSize);
          newResult.push(chunk);
        }
        let paginateData = Object.keys(newResult);
        let paginateArray = [];
        paginateData.forEach((element) => {
          paginateArray.push({ key: parseInt(element) + 1 });
        });
        let first = 0;
        let last = 0;
        if (listIndex) {
          first = listIndex - 1;
          if (listIndex != paginateData.length) {
            last = listIndex + 1;
          }
        }
        let paginate = {
          first: first,
          last: last,
          array: paginateArray,
        };
        const getStatus = leftMenuSuppy.get({
          change: "sales",
          childEffect: { name: "view" },
        });
        res.render("sales/index", {
          moduleName: name,
          title: name + " List | " + title,
          message: msg,
          tableData: newResult[listIndex],
          url: getStatus,
          data: AuthData,
          asset,
          paginate,
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
          change: "sales",
          childEffect: { name: "create" },
        });
        console.log({ getStatus });
        res.render("sales/create", {
          moduleName: name,
          title: name + " List | " + title,
          url: getStatus,
          data: AuthData,
          countries: country,
          asset,
        });
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
      let roleId = 3;
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
                  addressfield8: req.body.country,
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
                    req.session.flag = process.env.ModuleCreateCode;
                    res.redirect("/sales");
                  }
                });
              }
            });
          } else {
            res.redirect("/sales/create");
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
        let countries = queries.countriesIndex();
        conn.query(countries, (err, country) => {
          if (err) {
            console.log(err);
          }
          if (country) {
            let editSelectStatus = select.draw(
              country,
              editUser[0].addressfield8
            );
            console.log({ editSelectStatus });
            res.render("sales/edit", {
              moduleName: name,
              title: name + " List | " + title,
              tableStatus: tStatus,
              data: AuthData,
              editData: editUser[0],
              countries: country,
              asset,
              editSelectStatus,
            });
          }
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
            addressfield8: req.body.country,
            where: { userId: id },
          };
          const userCreateAddress = {
            userId: id,
            addressfield1: req.body.address,
            addressfield2: req.body.city,
            addressfield3: req.body.state,
            addressfield4: req.body.zipCode,
            addressfield8: req.body.country,
          };
          const updateUser = queries.edit(table.user, userData);
          const getUserAddress = queries.oneAddressIndex(id);
          const updateUserAddress = queries.edit(
            table.address,
            userEditAddress
          );
          const createUserAddress = queries.create(
            table.address,
            userCreateAddress
          );
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
                      req.session.flag = process.env.ModuleUpdateCode;
                      res.redirect("/sales");
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
                      req.session.flag = process.env.ModuleUpdateCode;
                      res.redirect("/sales");
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
      const sqDb = queries.oneUserAddressDelete(id);
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      console.log({ sqDb });
      conn.query(sqDb, (err, result) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (result) {
          req.session.flag = process.env.ModuledeleteCode;
          res.redirect("/sales");
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
  req.session.listIndex = parseInt(id) - 1;
  res.redirect("/sales");
});

router.post("/search/index", (req, res) => {
  const data = req.body.val;
  const sqDb = queries.salesSearch(data);
  conn.query(sqDb, (err, result)=>{
    if(err){
      console.log(err);
    }
    if(result.length){
      res.send({data:result,status:200})
    }else{
      res.send({data:null, status:404})
    }
  })
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
