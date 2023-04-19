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
var name = "hairSubCategory";
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
        let tStatus = tablestatus.draw(htmltable);
        const getStatus = leftMenuSuppy.get({change:'hairSub',childEffect:{name:'view'}});
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
        res.render("hairSubCategory/index", {
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
  const asset = handler + req.headers.host;
  if (req.session.data) {
    const AuthData = req.session.data;
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let htmltable = "user";
    let tStatus = tablestatus.draw(htmltable);
    const getStatus = leftMenuSuppy.get({change:'hairSub',childEffect:{name:'create'}});
    res.render("hairSubCategory/create", {
      moduleName: name,
      title: name + " Create | " + title,
      tableStatus: tStatus,
      data: AuthData,
      url:getStatus,
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
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({ status: false });
        return;
      } else {
        const createData = {
          name: req.body.name,
          description: req.body.description,
          isEnabled: req.body.isEnabled || 0,
        };

        const createUser = queries.create(table.hairSubCategory, createData);
        conn.query(createUser, (err1, user) => {
          if (err1) {
            console.log(err1);
            req.session.flag = "iURL";
            // res.redirect("/");
            res.send({ status: false });
            return;
          }
          if(user){
            req.session.hairSubCategoryId = user.insertId;
            req.session.flag = process.env.ModuleCreateCode;
            res.send({ status: true });
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
    if (!table[name]) {
      req.session.flag = "iURL";
      res.redirect("/");
      return;
    }
    let htmltable = "user";
    const sqDb = queries.onehairSubCategoryIndex(id);
    let tStatus = tablestatus.draw(htmltable);
    conn.query(sqDb, (err, res1) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      if (res1.length) {
        console.log(res1);
        res.render("hairSubCategory/edit", {
          moduleName: name,
          title: name + " Edit | " + title,
          tableStatus: tStatus,
          data: AuthData,
          editData: res1[0],
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
  const asset = handler + req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.edit) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const insertData = {
        name: req.body.name,
        description: req.body.description,
        isEnabled: req.body.isEnabled || 0,
        where: { id: id },
      };
      const sqDb = queries.edit(table.hairSubCategory,insertData);
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
        if (editUser) {
          req.session.hairSubCategoryId = id;
          req.session.flag = process.env.ModuleUpdateCode;
          res.send({status:true});
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
  const asset = handler + req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.delete) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.deleteIndex(table.hairSubCategory,id);
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
          req.session.flag = process.env.ModuleDeleteCode;
          res.redirect("/hairSubCategory");
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
  res.redirect("/hairSubCategory");
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
