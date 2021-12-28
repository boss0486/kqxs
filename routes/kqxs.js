const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config(); 

// ***********************************************************************************************************************************
const kqxsController = require("../model/controller/lottery_result_full.controller");
// api get all
router.post(`/all`,  async (req, res, next) => { 
  return res.json(await kqxsController.dataList(req));
});
// api get by id
router.get(`/:id`,  async (req, res, next) => {
  return res.json(await kqxsController.get(req.params.id));
});
// api create
router.post(`/create`,  async (req, res, next) => {
  return res.json(await kqxsController.create(req.body));
});
// api update
router.put(`/update`,  async (req, res, next) => {
  return res.json(await kqxsController.update(req.body));
});
// api delete
router.delete(`/delete`,  async (req, res, next) => {
  return res.json(await kqxsController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;
