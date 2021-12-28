const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config(); 

// ***********************************************************************************************************************************
const lotteryResultFullController = require("../model/controller/lottery_result_full.controller");
// api get all
router.post(`/all`,  async (req, res, next) => {
  return res.json(await lotteryResultFullController.dataList(req));
});
// api get by id
router.get(`/:id`,  async (req, res, next) => {
  return res.json(await lotteryResultFullController.get(req.params.id));
});
// api create
router.post(`/create`,  async (req, res, next) => {
  return res.json(await lotteryResultFullController.create(req.body));
});
// api update
router.put(`/update`,  async (req, res, next) => {
  return res.json(await lotteryResultFullController.update(req.body));
});
// api delete
router.delete(`/delete`,  async (req, res, next) => {
  return res.json(await lotteryResultFullController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;
