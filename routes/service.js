const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// ***********************************************************************************************************************************
const serviceController = require("../model/controller/service.controller");
// api get all
router.post(`/all`, async(req, res, next) => {
    return res.json(await serviceController.dataList(req));
});
// api get all
router.post(`/history`, async(req, res, next) => {
    return res.json(await serviceController.history(req.body, req.header('auth-token')));
});
// api get by id
router.get(`/:id`, async(req, res, next) => {
    return res.json(await serviceController.get(req.params.id));
});
router.post(`/matched`, async(req, res, next) => {
    return res.json(await serviceController.exMatched(req.body));
});
// api create
router.post(`/create`, async(req, res, next) => {
    return res.json(await serviceController.create(req.body));
});
// api update
router.put(`/update`, async(req, res, next) => {
    return res.json(await serviceController.update(req.body));
});
// api delete
router.delete(`/delete`, async(req, res, next) => {
    return res.json(await serviceController.delete(req.body.id));
});

// ***********************************************************************************************************************************
module.exports = router;