var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var bcrypt = require("bcrypt");
var conn = require("../database/conn");
const leftbuilder = require("../service/html/leftBuilder");
let Operation = require("../database/lib/operation");
let Table = require("../database/lib/table");
let Query = require("../database/query");
const LeftStatus = require("../service/html/leftStatus");
const SessionUser = require("../service/html/sessionUser");
const leftBuilder = new leftbuilder();
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const authUser = new SessionUser();
const operations = operationSupply.focus();
const table = tableSupply.focus();
let handler = 'http://';

const { validator } = require("../validator");
const userTable = "users";
const roleTable = "roles";
const title = "SalonFinder";

/* GET home page. */
router.get("/", (req, res, next) => {
  const asset = handler+req.headers.host;
  if (req.session.data) {
    auth(res);
  } else {
    if (req.session.flag == 5) {
      res.render("Auth/login", {
        title: title,
        message: "Please Login your Account.",
        code: 501,
        flag: 1,
      });
    } else if (req.session.flag == "uMP") {
      res.render("Auth/login", {
        title: title,
        message: "invalid credentials",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == "iU") {
      res.render("Auth/login", {
        title: title,
        message: "this user don't have access for login",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == "nU") {
      res.render("Auth/login", {
        title: title,
        message: "invalid credentials",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == "iR") {
      res.render("Auth/login", {
        title: title,
        message: "User Group is removed.",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == "iURL") {
      res.redirect("/error");
    } else if (req.session.flag == "PD") {
      res.render("Auth/login", {
        title: title,
        message: "Permisson Denied.",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == 3) {
      res.render("Auth/login", {
        title: title,
        message: "Password is not matched with Confim Password.",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == 2) {
      res.render("Auth/login", {
        title: title,
        message: "User Registeration successfull.",
        code: 502,
        flag: 1,
      });
    } else if (req.session.flag == 1) {
      res.render("Auth/login", {
        title: title,
        message: "Email is Alerday Used.",
        code: 502,
        flag: 1,
      });
    }
    req.session.destroy();
    res.render("Auth/login", { title: title,asset });
    return;
  }
});
router.get("/register", (req, res, next) => {
  const asset = handler+req.headers.host;
  if (req.session.data) {
    auth(res);
  } else if (req.session.errorData) {
    res.render("Auth/register", {
      title: title,
      errorData: req.session.errorData,
      bodyData: req.session.bodyData,
    });
  } else {
    req.session.destroy();
  }
  res.render("Auth/register", { title: title });
});

router.get("/forgotten", (req, res, next) => {
  if (req.session.data) {
    auth(res);
  }
  res.render("Auth/password", { title: title,asset });
});

/* Authentication for registration */
router.post("/auth_reg", validator, (req, res, next) => {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;
  var cpassword = req.body.confimPassword;
  var contactNumber = req.body.contactNumber;
  var roleId = 4;
  var isEnabled = 0;
  console.log({ fullname, email, password, contactNumber, roleId, isEnabled });

  if (password == cpassword) {
    var sql = "select * from " + userTable + " where email = ?;";

    conn.query(sql, [email], (err, result, fields) => {
      if (err) throw err;

      if (result.length > 0) {
        req.session.flag = 1;
        res.redirect("/");
      } else {
        var hashPassword = bcrypt.hashSync(password, 10);
        var sql =
          "insert into " +
          userTable +
          "(fullname, email, password,contactNumber,roleId,isEnabled) values (?,?,?,?,?,?);";
        conn.query(
          sql,
          [fullname, email, hashPassword, contactNumber, roleId, isEnabled],
          (err, result, fields) => {
            if (err) throw err;
            req.session.flag = 2;
            res.redirect("/");
          }
        );
      }
    });
  } else {
    req.session.flag = 3;
    res.redirect("/");
  }
});

/* Authentication for login */
router.post("/auth_login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  let loggedVia = undefined;
  if (username % 1 == 0) {
    loggedVia = "contactNumber";
  } else {
    loggedVia = "email";
  }
  var sql = `select * from ${userTable} where ${loggedVia}=?;`;

  conn.query(sql, [username], (err, result, fields) => {
    if (err) {
      console.log(err);
    }
    if (result.length) {
      let Userdata = result[0];
      if (Userdata.isEnabled == 0) {
        req.session.flag = "iU";
        res.redirect("/");
        return;
      }
      let rolesql = `select * from ${roleTable} where id=${Userdata.roleId}`;
      conn.query(rolesql, (err, roleresult, fields) => {
        if (err) {
          console.log(err);
          return;
        }
        if (roleresult.length) {
          if (roleresult[0].isEnabled == 0) {
            req.session.flag = "iR";
            res.redirect("/");
            return;
          }
          let permission = roleresult[0].permission;
          let sessionData = {
            id: Userdata.id,
            roleId: Userdata.roleId,
            roleName: roleresult[0].name,
            fullName: Userdata.fullName,
            email: Userdata.email,
            contactNumber: Userdata.contactNumber,
            profilePic: Userdata.profilePic,
            isEnabled: 1,
            ethnicityId: Userdata.ethnicityId,
            permission: JSON.parse(permission),
          };
          var hashedPassword = bcrypt.compareSync(password, result[0].password);
          if (result.length && hashedPassword) {
            req.session.data = sessionData;
            res.redirect("/home");
            return;
          } else {
            req.session.flag = "uMP";
            res.redirect("/");
            return;
          }
        }
      });
    } else {
      req.session.flag = "nU";
      res.redirect("/");
      return;
    }
  });
});

/* Home page router */
router.get("/home", (req, res, next) => {
  const asset = handler+req.headers.host;
  const leftMenuSuppy = new LeftStatus();
  const getStatus = leftMenuSuppy.get({change:'dashboard',childEffect:undefined});
  if (req.session.data) {
    console.log(req.session.data)
    // const htmlConditons = leftBuilder.inlet(req.session.data.permission)
    // console.log(req.session.data.permission);
    res.render("Auth/index", {
      message: "Welcome, " + req.session.data.fullName,
      data: req.session.data,
      title: "Dashboard | " + title,
      url: getStatus,asset
    });
  } else {
    req.session.flag = 5;
    res.redirect("/");
  }
});
router.get("/dashboard", (req, res, next) => {
  if (req.session.data) {
    res.render("index", {
      message: "Welcome, " + req.session.data.name,
      data: req.session.data,asset
    });
  } else {
    req.session.flag = 5;
    res.redirect("/");
  }
});

/* Logout router */
router.get("/logout", (req, res) => {
  if (req.session.data) {
    req.session.destroy();
  }
  res.redirect("/");
});

router.get("/error", (req, res) => {
  const asset = handler+req.headers.host;
  res.render("Misc/error", {
    title: title,
    flag: 1,
    asset
  });
});

router.get("/profile", (req, res) => {
  const asset = handler+req.headers.host;
  if (req.session.data) {
    const auth = req.session.data;
    let insertedTable = table.countries;
    let operation = operations.index;
    let query = queries.multi(operation, insertedTable);
    let msg = '';
    let code = false;
    conn.query(query, (err, result, fields) => {
      if (err) {
        console.log(err);
        req.session.flag = "iURL";
        res.redirect("/");
      }
      if (result) {
        if(req.session.flag){
          if(req.session.flag == 200){
            req.session.flag =false;
            code = true;
            msg = "Profile updated Successfully";
          }
        }
        console.log({auth});
        res.render("Auth/profile/userProfile", {
          title: "User Profile | " + title,
          data: auth,
          countries: result,asset
        });
      }
    });
  } else {
    res.redirect("/");
  }
});
router.get("/salonProfile", (req, res) => {
  const asset = handler+req.headers.host;
  if (req.session.data) {
    if (req.session.data.permission.miscChild.settingChild.salon) {
      res.render("Auth/profile/salonProfile", {
        title: "Salon Profile | " + title,
        data: req.session.data,asset
      });
    } else {
      permissionDenied(req, res);
    }
  } else {
    res.redirect("/");
  }
});
router.get("/setting", (req, res) => {
  const asset = handler+req.headers.host;
  const leftMenuSuppy = new LeftStatus();
  const getStatus = leftMenuSuppy.get({change:'setting',childEffect:undefined});
  if (req.session.data) {
    if (req.session.data.permission.miscChild.settingChild.settings) {
      res.render("Auth/profile/rootProfile", {
        title: "Settings | " + title,
        data: req.session.data,
        url: getStatus,asset
      });
    } else {
      permissionDenied(req, res);
    }
  } else {
    res.redirect("/");
  }
});

router.get("/splash-screen", (req, res) => {
  const asset = handler+req.headers.host;
  const leftMenuSuppy = new LeftStatus();
  const getStatus = leftMenuSuppy.get({change:'mobileSetting',childEffect:undefined});
  if (req.session.data) {
    if (req.session.data.permission.miscChild.settingChild.settings) {
      conn.query(`SELECT name,description FROM splashdescription WHERE id = 1`,(error,result)=>{
        if(error){
          res.redirect("/");
        }
        if(result.length){
          res.render("Auth/profile/splash", {
            title: "Settings | " + title,
            data: req.session.data,
            formData:result[0],
            url: getStatus,asset
          });

        }else{
          res.redirect("/");
        }
      })
    } else {
      permissionDenied(req, res);
    }
  } else {
    res.redirect("/");
  }
});

router.post("/update-splash", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.miscChild.settingChild.settings) {
      conn.query(`UPDATE splashdescription SET name = '${req.body.title}', description = '${req.body.description}' WHERE splashdescription.id = 1;`,(error,result)=>{
        if(error){
          res.redirect("/");
        }
        if(result){
          res.redirect("/splash-screen");
        }
      })
    } else {
      permissionDenied(req, res);
    }
  } else {
    res.redirect("/");
  }
});

router.post("/profile", (req, res) => {
  if (req.session.data) {
    if (req.session.data.permission.miscChild.settingChild.profile) {
      const userData = {
        fullName: req.body.firstName,
        email: req.body.email,
        contactNumber: req.body.phoneNumber,
        where: { id: req.session.data.id },
      };
      const userEditAddress = {
        type: 1,
        addressfield1: req.body.address,
        addressfield2: req.body.city,
        addressfield3: req.body.state,
        addressfield4: req.body.zipCode,
        addressfield5: req.body.country,
        where: { userId: req.session.data.id },
      };
      const userCreateAddress = {
        type: 1,
        userId:req.session.data.id,
        addressfield1: req.body.address,
        addressfield2: req.body.city,
        addressfield3: req.body.state,
        addressfield4: req.body.zipCode,
        addressfield5: req.body.country,
      };
      const getUser = queries.oneUserIndex(req.session.data.id);
      const getUserAddress = queries.oneAddressIndex(req.session.data.id);
      const updateUser = queries.edit(table.user,userData);
      const updateUserAddress = queries.edit(table.address, userEditAddress);
      const createUserAddress = queries.create(table.address,userCreateAddress);
      const authUserData = queries.AuthUser(req.session.data.id);
      conn.query(getUser, (err1, user) => {
        if (err1) {
          console.log(err1);
          req.session.flag = "iURL";
          res.redirect("/");
          return;
        }
        if (user.length > 0) {
          conn.query(updateUser, (err2, result) => {
            if (err2) {
              console.log(err2);
              req.session.flag = "iURL";
              res.redirect("/");
              return;
            }
            if (result) {
              //session update is left
              conn.query(authUserData, (err3, auth) => {
                if (err3) {
                  console.log(err3);
                  req.session.flag = "iURL";
                  res.redirect("/");
                  return;
                }
                if (auth.length) {
                  const authData = authUser.draw(auth[0]);
                  console.log({authData});
                  req.session.data = {};
                  req.session.data = authData;
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
                          res.redirect('/profile');
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
                          res.redirect('/profile');
                        }
                      });
                    }
                  });
                } else {
                  res.redirect("/logout");
                }
              });
            }
          });
        } else {
          res.redirect("/logout");
        }
      });
    } else {
      permissionDenied(req, res);
    }
  } else {
    res.redirect("/");
  }
});

function permissionDenied(req, res) {
  req.session.flag = "PD";
  res.redirect("/");
}

function auth(res) {
  res.redirect("/home");
}
function notAuth(req, res) {
  req.session.flag = 5;
  res.redirect("/");
}

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    debug(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = router;
