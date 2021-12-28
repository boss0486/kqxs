const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// layout
// set template engine
router.get(`/login`, async (req, res, next) => {
  return res.render("authen", { title: "Đăng nhập", layout: './layouts/_blank', sizeMap: "" });
});

router.get(`/index`, async (req, res, next) => {
  return res.render("authen", { title: "Đăng nhập", sizeMap: "" });
});
// ************************************************************************************************************
const loginController = require("../model/controller/login.controller");
// api check uuid
router.post(`/uuid`, async (req, res, next) => {
  return res.json(await loginController.uuid(req.body.uuid));
});
router.post(`/login`, async (req, res, next) => {
  return res.json(await loginController.login(req, req.body));
});
router.post(`/logout`, async (req, res, next) => {
  return res.json(await loginController.logout(req, req.body));
});
//**********************************************************************************************************************************
module.exports = router;
