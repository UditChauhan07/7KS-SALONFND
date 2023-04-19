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
var name = "hairCategory";
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
    let index = 5;
    let query = queries.multi(operation, insertedTable, null, index);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        const getStatus = leftMenuSuppy.get({change:'hairCat',childEffect:{name:'view'}});
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
        res.render("hairCategory/index", {
          moduleName: name,
          title: name + " List | " + title,
          successCode: code,
          message: msg,
          tableData: newResult[listIndex],
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

    let htmltable = "user";
    let tStatus = tablestatus.draw(htmltable);
    const getStatus = leftMenuSuppy.get({change:'hairCat',childEffect:{name:'create'}});
    res.render("hairCategory/create", {
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
      let roleId = 5;
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({status:false})
        return;
      } else {
        const insertedData = {
          name: req.body.name,
          description: req.body.description,
          isEnabled: req.body.isEnabled || 0,
        };

        const createUser = queries.create(table.hairCategory, insertedData);
        conn.query(createUser, (err1, user) => {
          if (err1) {
            console.log(err1);
            req.session.flag = "iURL";
            // res.redirect("/");
        res.send({status:false})

          }
          if (user) {
            req.session.hairCategoryId = user.insertId
            req.session.flag = process.env.ModuleCreateCode;
            res.send({status:true})      
      }
    })
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
    const sqDb = queries.onehairtypecategories(id);
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
        console.log(editUser);
        res.render("hairCategory/edit", {
          moduleName: name,
          title: name + " Edit | " + title,
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
  if (req.session.data) {
    var id = req.params.id;
    if (req.session.data.permission.userChild.adminChild.create) {
      let roleId = 5;
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({status:false})
        return;
      } else {
        const insertedData = {
          name: req.body.name,
          description: req.body.description,
          isEnabled: req.body.isEnabled || 0,
          where:{id:id}
        };

        const createUser = queries.edit(table.hairCategory, insertedData);
        conn.query(createUser, (err1, user) => {
          if (err1) {
            console.log(err1);
            req.session.flag = "iURL";
            // res.redirect("/");
        res.send({status:false})
          }
          if (user) {
            console.log({user, id});
            req.session.hairCategoryId = id
            req.session.flag = process.env.ModuleUpdateCode;
            res.send({status:true})      
      }
    })
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
  const asset = handler+req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.delete) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const sqDb = queries.deleteIndex(table.hairCategory,id);
      if (!table[name]) {
        req.session.flag = "iURL";
        res.redirect("/");
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      conn.query(sqDb, (err, result) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (result) {
          req.session.flag = process.env.ModuleDeleteCode;
                      res.redirect("/hairCategory");
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
  res.redirect("/hairCategory");
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
