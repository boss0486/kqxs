const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// ***********************************************************************************************************************************
const kqxsMatchedController = require("../model/controller/kqxs_matched.controller");
// api get all
router.post(`/all`, async(req, res, next) => {
    return res.json(await kqxsMatchedController.dataList(req.body));
});
// api get by id
router.get(`/:id`, async(req, res, next) => {
    return res.json(await kqxsMatchedController.get(req.params.id));
});
// api create
router.post(`/create`, async(req, res, next) => {
    return res.json(await kqxsMatchedController.create(req.body));
});
// api update
router.post(`/update`, async(req, res, next) => {
    return res.json(await kqxsMatchedController.update(req.body));
});
// api delete
router.post(`/delete`, async(req, res, next) => {
    return res.json(await kqxsMatchedController.delete(req.body.id));
});

// ***********************************************************************************************************************************
module.exports = router;