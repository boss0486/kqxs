const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// ***********************************************************************************************************************************
const areaGeographicalController = require("../model/controller/area_geographical.controller");
// api get all
router.post(`/all`,  async (req, res, next) => {
  return res.json(await areaGeographicalController.dataList(req));
});
// api get by id
router.get(`/:id`,  async (req, res, next) => {
  return res.json(await areaGeographicalController.get(req.params.id));
});
// api create
router.post(`/create`,  async (req, res, next) => {
  return res.json(await areaGeographicalController.create(req.body));
});
// api update
router.put(`/update`,  async (req, res, next) => {
  return res.json(await areaGeographicalController.update(req.body));
});
// api delete
router.delete(`/delete`,  async (req, res, next) => {
  return res.json(await areaGeographicalController.delete(req.body.id));
});

// ***********************************************************************************************************************************
module.exports = router;
