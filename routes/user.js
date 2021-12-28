const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();
 
// layout
//const expressLayout =  require("express-ejs-layouts");

// set template engine
 
// ************************************************************************************************************
const loginController = require("../model/controller/login.controller");
// api get all
router.post(`/all`, async (req, res, next) => {
  return res.json(await loginController.dataList(req));
});
// api get by id
router.get(`/:id`, async (req, res, next) => {
  return res.json(await loginController.get(req.params.id));
});
// api create
router.post(`/create`, async (req, res, next) => {
  return res.json(await loginController.create(req.body));
});
// api update
router.put(`/update`, async (req, res, next) => {
  return res.json(await loginController.update(req.body));
});
// api delete
router.delete(`/delete`, async (req, res, next) => {
  return res.json(await loginController.delete(req.body.id));
});
//**********************************************************************************************************************************
module.exports = router;
