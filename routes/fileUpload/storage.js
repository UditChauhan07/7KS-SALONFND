var express = require("express");
let path = require("path");
let multer = require("multer");
var router = express.Router();
let Query = require("../../database/query");
let Table = require("../../database/lib/table");
let Operation = require("../../database/lib/operation");
const conn = require("../../database/conn");
const tableSupply = new Table();
const operationSupply = new Operation();
const queries = new Query();
const table = tableSupply.focus();
const operations = operationSupply.focus();
const bstorage = multer.diskStorage({
  destination: "./public/uploads/businessType/",
  filename: function (req, file, cb) {
    cb(null, "BL-" + Date.now() + path.extname(file.originalname));
  },
});

const bupload = multer({
  storage: bstorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/business", function (req, res, next) {
  if (req.session.businessNewId) {
    bupload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        let fullpath = req.file.destination.split("./public");
        const query = queries.getBusinessTypeIndex(req.session.businessNewId);
        const updateData = {
          logo: fullpath[1] + req.file.filename,
          where: { id: req.session.businessNewId },
        };
        console.log(req.file, { updateData });
        const editBusiness = queries.edit(table.business, updateData);
        conn.query(editBusiness, (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            req.session.businessNewId = undefined;
            res.redirect("/business");
          }
        });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/business/create");
  }
});
const bSstorage = multer.diskStorage({
  destination: "./public/uploads/business/",
  filename: function (req, file, cb) {
    cb(null, "BL-" + Date.now() + path.extname(file.originalname));
  },
});

const bSupload = multer({
  storage: bSstorage,
  limits: { fieldSize: 1000000 },
}).single("file");
router.post("/business-salon", function (req, res, next) {
  if (req.session.businessId) {
    bSupload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        let fullpath = req.file.destination.split("./public");
        const updateData = {
          logo: fullpath[1] + req.file.filename,
          where: { id: req.session.businessId },
        };
        console.log(req.file, { updateData });
        const editBusiness = queries.edit(table.salon, updateData);
        conn.query(editBusiness, (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            req.session.businessId = undefined;
            res.redirect("/salon");
          }
        });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/salon/create");
  }
});

const sCstorage = multer.diskStorage({
  destination: "./public/uploads/businessType/",
  filename: function (req, file, cb) {
    cb(null, "SC-" + Date.now() + path.extname(file.originalname));
  },
});

const sCupload = multer({
  storage: sCstorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/serviceCategory", function (req, res, next) {
  console.log("mmmmm");
  console.log(req.session.serviceCategoryNewId);
  if (req.session.serviceCategoryNewId) {
    sCupload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        let fullpath = req.file.destination.split("./public");
        const query = queries.getBusinessTypeIndex(
          req.session.serviceCategoryNewId
        );
        const updateData = {
          logo: fullpath[1] + req.file.filename,
          where: { id: req.session.serviceCategoryNewId },
        };
        console.log(req.file, { updateData });
        const editBusiness = queries.edit(table.serviceCategory, updateData);
        conn.query(editBusiness, (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result) {
            req.session.serviceCategoryNewId = undefined;
            res.redirect("/serviceCategory");
          }
        });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/business/create");
  }
});

const sStorage = multer.diskStorage({
  destination: "./public/uploads/service/",
  filename: function (req, file, cb) {
    cb(null, "SR-" + Date.now() + path.extname(file.originalname));
  },
});

const sUpload = multer({
  storage: sStorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/service", function (req, res, next) {
  console.log("boooo");
  console.log(req.session.serviceIdArray);
  if (req.session.serviceIdArray) {
    sUpload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
        req.session.serviceIdArray.forEach((a, i) => {
          let fullpath = req.file.destination.split("./public");
          const query = queries.getBusinessTypeIndex(a);
          console.log({ query });
          const updateData = {
            logo: fullpath[1] + req.file.filename,
            where: { id: a },
          };
          const editBusiness = queries.edit(table.service, updateData);
          console.log(req.file, { updateData, editBusiness });
          conn.query(editBusiness, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
                if(i == req.session.serviceIdArray.length -1){
                    req.session.serviceIdArray = undefined;
                    res.redirect("/service");
                }
            }
          });
        });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/business/create");
  }
});

const hCStorage = multer.diskStorage({
  destination: "./public/uploads/hairCategory/",
  filename: function (req, file, cb) {
    cb(null, "HC-" + Date.now() + path.extname(file.originalname));
  },
});

const hCUpload = multer({
  storage: hCStorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/hairCategory", function (req, res, next) {
  console.log(req.session.hairCategoryId);
  if (req.session.hairCategoryId) {
    hCUpload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
          let fullpath = req.file.destination.split("./public");
          const updateData = {
            logo: fullpath[1] + req.file.filename,
            where: { id: req.session.hairCategoryId },
          };
          const editBusiness = queries.edit(table.hairCategory, updateData);
          conn.query(editBusiness, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              req.session.hairCategoryId = undefined;
              res.redirect("/hairCategory");
            }
          });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/hairCategory/create");
  }
});

const hSCStorage = multer.diskStorage({
  destination: "./public/uploads/hairSubCategory/",
  filename: function (req, file, cb) {
    cb(null, "HS-" + Date.now() + path.extname(file.originalname));
  },
});

const hSCUpload = multer({
  storage: hSCStorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/hairSubCategory", function (req, res, next) {
  console.log(req.session.hairSubCategoryId);
  if (req.session.hairSubCategoryId) {
    hSCUpload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
          let fullpath = req.file.destination.split("./public");
          const updateData = {
            logo: fullpath[1] + req.file.filename,
            where: { id: req.session.hairSubCategoryId },
          };
          const editBusiness = queries.edit(table.hairSubCategory, updateData);
          conn.query(editBusiness, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              req.session.hairSubCategoryId = undefined;
              res.redirect("/hairSubCategory");
            }
          });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/hairSubCategory/create");
  }
});

const hTStorage = multer.diskStorage({
  destination: "./public/uploads/hairType/",
  filename: function (req, file, cb) {
    cb(null, "HT-" + Date.now() + path.extname(file.originalname));
  },
});

const hTUpload = multer({
  storage: hTStorage,
  limits: { fieldSize: 1000000 },
}).single("file");

router.post("/hairType", function (req, res, next) {
  console.log(req.session.hairTypeId);
  if (req.session.hairTypeId) {
    hTUpload(req, res, (err) => {
      if (err) {
        console.log(err);
      } else {
          let fullpath = req.file.destination.split("./public");
          const updateData = {
            logo: fullpath[1] + req.file.filename,
            where: { id: req.session.hairTypeId },
          };
          const editBusiness = queries.edit(table.hairType, updateData);
          conn.query(editBusiness, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result) {
              req.session.hairTypeId = undefined;
              res.redirect("/hairType");
            }
          });
      }
    });
  } else {
    req.session.flag = false;
    req.session.flag = 502;
    res.redirect("/hairType/create");
  }
});

module.exports = router;
