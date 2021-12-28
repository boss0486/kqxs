const express = require('express');
const router = express.Router();
// read .env file
require('dotenv').config();

// ***********************************************************************************************************************************
const bosoCategoryController = require("../model/controller/boso_category.controller");
// api get all
router.post(`/all`, async(req, res, next) => {
    return res.json(await bosoCategoryController.dataList(req.body));
});
router.post(`/app-all`, async(req, res, next) => {
    return res.json(await bosoCategoryController.dataListApi(req.body));
});
// api get by id
router.get(`/:id`, async(req, res, next) => {
    return res.json(await bosoCategoryController.get(req.params.id));
});
// api create
router.post(`/create`, async(req, res, next) => {
    return res.json(await bosoCategoryController.create(req.body));
});
// api update
router.post(`/update`, async(req, res, next) => {
    return res.json(await bosoCategoryController.update(req.body));
});
// api delete
router.post(`/delete`, async(req, res, next) => {
    console.log('okkkkkkk:' + req.body.id);
    return res.json(await bosoCategoryController.delete(req.body.id));
});
// ***********************************************************************************************************************************
module.exports = router;