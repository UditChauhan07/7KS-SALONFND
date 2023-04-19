var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var bcrypt = require("bcrypt");
var conn = require("../database/conn");
let Query = require("../database/query");
let Table = require("../database/lib/table");
let Operation = require("../database/lib/operation");
let TableStatus = require("../service/html/tableStatus");
const LeftStatus = require("../service/html/leftStatus");
const leftMenuSuppy = new LeftStatus();
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const tablestatus = new TableStatus();
const table = tableSupply.focus();
const operations = operationSupply.focus();

title = "Salon-Finder";

router.get("/", (req, res) => {
  req.session.flag = "iURL";
  res.redirect("/");
});

router.get("/:name", (req, res) => {
  const asset = req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    var name = req.params.name.toLocaleLowerCase();
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }

    let index = undefined;
    let htmltable = name;
    if (name == "sales") {
      index = 3;
      htmltable = "user";
    } else if (name == "admin") {
      index = 2;
      htmltable = "user";
    } else if (name == "salonUser") {
      index = 4;
      htmltable = "user";
    } else if (name == "user") {
      index = 5;
      htmltable = "user";
    }
    let tStatus = tablestatus.draw(htmltable);
    res.render("user/create", {
      moduleName: name,
      title: name + " List | " + title,
      tableStatus: tStatus,
      data: AuthData,asset
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/:name", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.create) {
      var name = req.params.name.toLocaleLowerCase();
      let roleId = undefined;
      if (name == "admin") {
        roleId = 2;
      } else if (name == "sales") {
        roleId = 3;
      } else if (name == "salonuser") {
        roleId = 4;
      } else {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
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
                    res.redirect("/service/" + name);
                  }
                });
              }
            });
          } else {
            res.redirect("/create/" + name);
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

function notAuth(req, res) {
  req.session.flag = 5;
  res.redirect("/");
}

function permissionDenied(req, res) {
  req.session.flag = "PD";
  res.redirect("/");
}
module.exports = router;
