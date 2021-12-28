const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();


// ***********************************************************************************************************************************
const bosoController = require("../model/controller/boso.controller");
// api get all
router.post(`/all`, async(req, res, next) => {
    return res.json(await bosoController.dataList(req.body, req.header('auth-token')));
});
// api get by id
router.get(`/:id`, async(req, res, next) => {
    return res.json(await bosoController.get(req.params.id));
});
// api get by cate
router.post(`/cate`, async(req, res, next) => {
    return res.json(await bosoController.getDetails(req.body, req.header('auth-token')));
});
// api get by area
router.post(`/area`, async(req, res, next) => {
    return res.json(await bosoController.getByAreaId(req.body, req.header('auth-token')));
});
// api create
router.post(`/create`, async(req, res, next) => {
    return res.json(await bosoController.create(req.body));
});
// api update
router.post(`/update`, async(req, res, next) => {
    return res.json(await bosoController.update(req.body));
});
// api delete
router.post(`/delete`, async(req, res, next) => {
    return res.json(await bosoController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;