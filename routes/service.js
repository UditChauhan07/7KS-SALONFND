var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var bcrypt = require("bcrypt");
var conn = require("../database/conn");
let Query = require("../database/query");
let Table = require("../database/lib/table");
let Operation = require("../database/lib/operation");
let TableStatus = require("../service/html/tableStatus");
const LeftStatus = require('../service/html/leftStatus');
const leftMenuSuppy = new LeftStatus();
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const tablestatus = new TableStatus();
const table = tableSupply.focus();
const operations = operationSupply.focus();
title = 'Salon-Finder';

router.get('/',(req,res)=>{
  req.session.flag = 'iURL';
  res.redirect("/");
})


router.get("/:name", (req, res) => {
  const asset = req.headers.host;
  if(req.session.data){
    const AuthData = req.session.data;
    var name = req.params.name.toLocaleLowerCase();
    if(!table[name]){
      req.session.flag = 'iURL';
      res.redirect("/");
      return;
    }
    let code = false;
    let msg = '';
    if(req.session.flag){
      if(req.session.flag == 200){
        req.session.flag =false;
        code = true;
        msg = name + " Created Successfully";
      }
    }
    let insertedTable = table[name];
    let operation = operations.index;
    let index = undefined;
    let htmltable = name;
    if(name == 'sales'){
      index= 3;
      htmltable = 'user';
    }else if(name == 'admin'){
      index = 2;
      htmltable = 'user';
    }else if(name == 'salonUser'){
      index = 4;
      htmltable = 'user';
    }else if (name == 'user'){
      index = 5
      htmltable = 'user';
    }
    let query = queries.multi(operation,insertedTable, null , index)
    conn.query(query,(err, result, fields)=>{
      if(err){
        console.log(err);
        req.session.flag = 'iURL';
        res.redirect("/");
      }
      if(result){
        let tStatus = tablestatus.draw(htmltable);
        res.render('user/index',{moduleName:name,title: name + ' List | ' + title,successCode:code, message:msg, tableData:result,tableStatus:tStatus,data: AuthData,asset});
      }
    })
  }else{
   notAuth(req, res)   
  }
    return;
});

router.post('/:name',(req, res)=>{
  var name = req.params.name.toLocaleLowerCase();
    if(!table[name]){
        req.session.flag = 'iURL';
        res.redirect("/");
    }else{
      let insertedTable = table[name];
      let data = req.body;
      let query = queries.create(insertedTable, data)
      conn.query(query,(err, result, fields)=>{
        if(err){
          req.session.flag = 402;
          res.redirect('/service/'+name)
        }
        if(result){
          req.session.flag = 200;
          res.redirect('/service/'+name)
        }
      })
      return;

    }
})


function notAuth(req, res) {
  req.session.flag = 5;
  res.redirect("/");
}
module.exports = router;
