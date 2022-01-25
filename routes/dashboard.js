const { ensureAuthenticated } = require('../config/auth')
const multer = require('multer')
const path = require('path');
const fs = require('fs');
const db = require("../models");
const { nanoid } = require("nanoid");
const Restaurant = db.restaurant;


module.exports = app => {
    const controller = require("../controllers/controller.js");
    var router = require("express").Router();
    
    var storage = multer.diskStorage({
        //設定上傳後文件路徑，public資料夾會自動建立。
           destination: function (req, file, cb) {
               cb(null, './public')
          },
          filename: function (req, file, cb) {
            cb(null, nanoid() + '.png') //Appending .png
          }
    });
    const upload = multer(
        {
            storage:storage,
            limit: {
                // 限制上傳檔案的大小為 20MB
                fileSize: 20000000
            }
        },
        {
            fileFilter(req, file, cb) {
                // 只接受三種圖片格式
                if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                    cb(new Error('Please upload an image'))
                }
                cb(null, true)
            }
        })

    //dashboard page
    router.post('/createMenu', upload.single('menu'), controller.createMenu)

    router.get('/restaurant/:restaurantId', async (req, res) => {
        try {
            // 透過 id 到資料庫尋找相對應的餐廳
            const restaurant = await Restaurant.findById(req.params.restaurantId)
            // 若無該餐廳
            if (!restaurant || !restaurant.menu) {
                throw new Error()
            }
            res.send({
                restaurantName: restaurant.restaurantName,
                restaurantPhone: restaurant.restaurantPhone,
                restaurantLocation: restaurant.restaurantLocation,
                serviceHour: restaurant.serviceHour,
                type: restaurant.type,
                dish: restaurant.dish,
                menu: restaurant.menu
            })
        } catch (error) {
            res.status(404).send()
        }
    })

    router.get('/restaurant/images/:restaurantId', async (req, res) => {
        try {
            // 透過 id 到資料庫尋找相對應的用戶
            const restaurant = await Restaurant.findById(req.params.restaurantId)
            // 若無該用戶，或用戶無大頭貼，則丟出錯誤
            if (!restaurant || !restaurant.menu) {
                throw new Error()
            }
            // 設定回傳 Header 的資料類型為 png 格式的圖片
            res.set('Content-Type', 'image/png')
            // 回傳大頭貼
            res.send()
        } catch (error) {
            res.status(404).send()
        }
    })
    

    router.post('/carts', controller.createCart)
    router.post('/orderRecord', controller.createOrderRecord)
    router.get('/restaurants', controller.findRestaurants)
    router.get('/carts', controller.findCarts)
    //router.put('/updateCart', controller.updateCart)
    app.use('/dashboard', router);
};