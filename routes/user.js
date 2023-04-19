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

router.get("/:id",(req,res)=>{
  const asset = req.headers.host;
  if (req.session.data) {
    console.log("uoooooooooooo");
    const AuthData = req.session.data;
    var name = 'admin';
    // var name = req.params.name.toLocaleLowerCase();
    var id = req.params.id;
    const sqDb = queries.oneUserAddressIndex(id);
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
    console.log("uooddddd",sqDb);
    conn.query(sqDb,(err, editUser)=>{
      if(err){
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      if(editUser.length){
        console.log(editUser);
        res.render("user/edit", {
          moduleName: name,
          title: name + " List | " + title,
          tableStatus: tStatus,
          data: AuthData,
          editData:editUser[0],asset
        });
      }
    })
  } else {
    notAuth(req, res);
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
