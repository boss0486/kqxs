const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config(); 

// ***********************************************************************************************************************************
const provinceController = require("../model/controller/province.controller");
// api get all
router.post(`/all`,  async (req, res, next) => {
  return res.json(await provinceController.dataList(req));
});
// api get by id
router.get(`/:id`,  async (req, res, next) => {
  return res.json(await provinceController.get(req.params.id));
});
// api create
router.post(`/create`,  async (req, res, next) => {
  return res.json(await provinceController.create(req.body));
});
// api update
router.put(`/update`,  async (req, res, next) => {
  return res.json(await provinceController.update(req.body));
});
// api delete
router.delete(`/delete`,  async (req, res, next) => {
  return res.json(await provinceController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;
