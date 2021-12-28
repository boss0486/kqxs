const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// ***********************************************************************************************************************************
const bosoController = require("../model/controller/buy_history.controller");
// api get all
router.post(`/all`,  async (req, res, next) => {
  return res.json(await bosoController.dataList(req));
});
// api get by id
router.get(`/:id`,  async (req, res, next) => {
  return res.json(await bosoController.get(req.params.id));
});
// api create
router.post(`/create`,  async (req, res, next) => {
  return res.json(await bosoController.create(req.body));
});
// api update
router.put(`/update`,  async (req, res, next) => {
  return res.json(await bosoController.update(req.body));
});
// api delete
router.delete(`/delete`,  async (req, res, next) => {
  return res.json(await bosoController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;
