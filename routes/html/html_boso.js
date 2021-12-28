 const express = require('express');
 const router = express.Router();

 const BosoModel = require("../../model/entities/app_boso");
 const BosoCategoryModel = require('../../model/entities/app_boso_category');
 const AreaGeographical = require("../../model/entities/area_geographical");

 // read .env file
 require('dotenv').config();
 router.get(`/index`, async(req, res, next) => {
     var areas = await AreaGeographical.find({}, { __v: 0, icon: 0, _id: 0 });
     return res.render("boso/index", {
         title: "Dự đoán: danh sách",
         layout: './layouts/_layout',
         sizeMap: "",
         models: {
             areaList: areas
         }
     });
 });
 router.get(`/create`, async(req, res, next) => {
     var areas = await AreaGeographical.find({}, { __v: 0, icon: 0, _id: 0 });
     var bosoCate = await BosoCategoryModel.find({}, { __v: 0, icon: 0, _id: 0 });
     //
     return res.render("boso/create", {
         title: "Dự đoán: tạo mới",
         layout: './layouts/_layout',
         sizeMap: "",
         models: {
             areaList: areas,
             bosoCate: bosoCate
         }
     });
 });
 router.get(`/update/:id`, async(req, res, next) => {
     var data = await BosoModel.findOne({ id: req.params.id }, { __v: 0, icon: 0, _id: 0, sortNo: 0 });
     var areas = await AreaGeographical.find({}, { __v: 0, icon: 0, _id: 0 });
     var bosoCate = await BosoCategoryModel.find({}, { __v: 0, icon: 0, _id: 0 });
     //
     return res.render("boso/update", {
         title: "Dự đoán: cập nhật",
         layout: './layouts/_layout',
         sizeMap: "",
         models: {
             areaList: areas,
             bosoCate: bosoCate,
             boso: data
         }
     });
 });
 // ***********************************************************************************************************************************
 module.exports = router;