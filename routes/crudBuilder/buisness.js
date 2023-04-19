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
var name = "business";
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
    let query = queries.multi(operation, insertedTable, null, index);
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        let tStatus = tablestatus.draw(name);
        const getStatus = leftMenuSuppy.get({
          change: name,
          childEffect: { name: "view" },
        });
        console.log({ result });
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
        res.render("businesstype/index", {
          moduleName: name,
          title: name + " List | " + title,
          message: msg,
          tableData: newResult[listIndex],
          paginate,
          tableStatus: tStatus,
          data: AuthData,
          url: getStatus,
          asset: asset,
        });
      }
    });
  } else {
    notAuth(req, res);
  }
  req.session.flag = false;
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
    const getStatus = leftMenuSuppy.get({
      change: name,
      childEffect: { name: "create" },
    });
    res.render("businesstype/create", {
      moduleName: name,
      title: name + " Create | " + title,
      tableStatus: tStatus,
      data: AuthData,
      url: getStatus,
      asset,
    });
  } else {
    notAuth(req, res);
  }
  return;
});

router.post("/create", (req, res) => {
  console.log(req.body);
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.create) {
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({ status: false });
        return;
      } else {
        const buisnessData = {
          name: req.body.name,
          description: req.body.description,
          isEnabled: req.body.isEnabled || 0,
        };

        const createBuisness = queries.create(table.business, buisnessData);
        console.log({ createBuisness });
        conn.query(createBuisness, (err1, result) => {
          if (err1) {
            req.session.flag = "iURL";
            // res.redirect("/");
            res.send({ status: false });
            return;
          }
          if (result) {
            console.log(result.insertId);
            req.session.flg = false;
            req.session.flag = process.env.ModuleCreateCode;
            req.session.businessNewId = result.insertId;
            res.send({ status: true });
            // res.redirect("/business");
          } else {
            res.send({ status: false });
            // res.redirect("/buisness/create");
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
    const sqDb = queries.oneBuisnessIndex(id);
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
        console.log({ editUser });
        res.render("businesstype/edit", {
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
  const asset = handler + req.headers.host;
  console.log("pppppp");
  if (req.session.data) {
    if (req.session.data.permission.userChild.adminChild.edit) {
      const AuthData = req.session.data;
      var id = req.params.id;
      const buisnessData = {
        name: req.body.name,
        description: req.body.description,
        isEnabled: req.body.isEnabled || 0,
        where: { id: id },
      };

      const createBuisness = queries.edit(table.business, buisnessData);
      if (!table[name]) {
        req.session.flag = "iURL";
        // res.redirect("/");
        res.send({ status: false });
        return;
      }
      let htmltable = "user";
      let tStatus = tablestatus.draw(htmltable);
      conn.query(createBuisness, (err, result) => {
        if (err) {
          console.log(err);
          req.session.flag = "iURL";
          // res.redirect("/");
          res.send({ status: false });
          return;
        }
        if (result) {
          req.session.flag = process.env.ModuleUpdateCode;
          req.session.businessNewId = id;
          console.log({ id });
          // res.redirect("/business");
          res.send({ status: true });
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
      const sqDb = queries.buisnessDelete(id);
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
          req.session.flag = process.env.ModuledeleteCode;
          res.redirect("/business");
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
  res.redirect("/business");
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
