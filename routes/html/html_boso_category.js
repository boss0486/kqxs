 const express = require('express');
 const router = express.Router();

 const BosoCategoryModel = require("../../model/entities/app_boso_category");

 // read .env file
 require('dotenv').config();
 router.get(`/index`, async(req, res, next) => {
     return res.render("boso-category/index", { title: "Nhóm bộ số: danh sách", layout: './layouts/_layout', sizeMap: "", models: null });
 });
 router.get(`/create`, async(req, res, next) => {
     return res.render("boso-category/create", { title: "Nhóm bộ số: tạo mới", layout: './layouts/_layout', sizeMap: "", models: null });
 });
 router.get(`/update/:id`, async(req, res, next) => {
     var data = await BosoCategoryModel.findOne({ id: req.params.id }, { __v: 0, icon: 0, _id: 0, sortNo: 0 });
     return res.render("boso-category/update", { title: "Nhóm bộ số: cập nhật", layout: './layouts/_layout', sizeMap: "", model: data });
 });
 // ***********************************************************************************************************************************
 module.exports = router;