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
var name = "service";
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
    let operation = operations.index;
    let htmltable = "user";
    let query = queries.multi(operation, table.service);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        const getStatus = leftMenuSuppy.get({change:'Service',childEffect:{name:'view'}});
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
        res.render("service/index", {
          moduleName: name,
          title: name + " List | " + title,
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
  const asset = handler+req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }

    const getStatus = leftMenuSuppy.get({change:'Service',childEffect:{name:'create'}});
    const serviceCategory = queries.serviceCategoryiesIndex();
    const businessType = queries.allBusinessTypeIndex();
    conn.query(serviceCategory, (err, category)=>{
      if(err){
        console.log(err);
      }
      if(category){
        console.log(category);
        conn.query(businessType,(err, buissness)=>{
          if(err){
            console.log(err);
          }
          if (buissness) {
            
            res.render("service/create", {
              moduleName: name,
              title: name + " Create | " + title,
              url: getStatus,
              data: AuthData,
              category:category,
              buissness:buissness,
              asset,
            });
          }
        })
      }
    })
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/create", (req, res) => {
  if (req.session.data) {
    var createdId = [];
    if (req.session.data.permission.userChild.adminChild.create) {
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({status:false})
        return;
      } else {
        console.log(req.body,req.body);
        if(req.body.serviceCategory){
            const createData = {
              name: req.body.name,
              description: req.body.description,
              serviceCatId:req.body.serviceCategory,
              businesstypeId:req.body.buissness,
              isEnabled: req.body.isEnabled || 0,
            };
            const createService = queries.create(table.service, createData);
            conn.query(createService, (err1, service) => {
              if (err1) {
                console.log(err1);
                // req.session.flag = "iURL";
                // res.redirect("/");
                failureStatus = true;
              }
              if (service) {
                req.session.serviceIdArray = [service.insertId];
                  res.send({status:true})
              }
            });
        }
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
    const sqDb = queries.oneServiceIndex(id);
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
        const serviceCategory = queries.serviceCategoryiesIndex();
        const businessType = queries.allBusinessTypeIndex();
        conn.query(serviceCategory, (err, cat)=>{
          if(err){
            console.log(err);
          }
          if(cat){
            conn.query(businessType,(err, buissness)=>{
              if(err){
                console.log(err);
              }
              if(buissness){
                res.render("service/edit", {
                  moduleName: name,
                  title: name + " Edit | " + title,
                  tableStatus: tStatus,
                  data: AuthData,
                  editData: editUser[0],
                  category:cat,
                  buissness:buissness,
                  asset,
                });
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
  if (req.session.data) {
    var id = req.params.id;
    if (req.session.data.permission.userChild.adminChild.create) {
      if (!table[name]) {
        req.session.flag = "iURL";
        res.send({status:false})
        return;
      } else {
        console.log(req.body['serviceCategory[]']);
            const createData = {
              name: req.body.name,
              description: req.body.description,
              serviceCatId:req.body.serviceCatId,
              businesstypeId:req.body.buissness,
              isEnabled: req.body.isEnabled || 0,
              where:{id:id}
            };
            const createService = queries.edit(table.service, createData);
            conn.query(createService, (err1, service) => {
              if (err1) {
                console.log(err1);
                failureStatus = true;
              }
              if (service) {
                console.log({service});
                req.session.serviceIdArray = [id];
                  res.send({status:true})
                successStatus = true;
              } else {
               failureStatus = true;
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

router.get('/:id/delete',(req,res)=>{
  const asset = req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.delete) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.deleteIndex(table.service,id);
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
          console.log(result);
          req.session.flag = 200;
                      res.redirect("/service");
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

router.get("/:id/index", (req, res) => {
  const id = req.params.id;
  req.session.listIndex = (parseInt(id)-1)
  res.redirect("/service");
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
