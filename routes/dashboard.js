const { ensureAuthenticated } = require('../config/auth')
const multer = require('multer')
const db = require("../models");
const { nanoid } = require("nanoid");
const Restaurant = db.restaurant;
const controller = require("../controllers/controller.js");

module.exports = app => {

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
            storage: storage,
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

    router.put('/restaurant/:restaurantId', upload.single('menu'), async (req, res) => {
        try {
            console.log(req.body)
            // 透過 id 到資料庫尋找相對應的餐廳
            const { restaurantName, restaurantPhone, restaurantLocation,
                serviceHour, type, dish } = req.body;
            const restaurant = await Restaurant.findById(req.params.restaurantId)
            // 若無該餐廳
            var parsedServiceHour = [];
            var parsedDish = [];
            serviceHour.forEach(element => {
                var parsed = JSON.parse(element);
                parsedServiceHour.push(parsed);
            });
            dish.forEach(element => {
                var parsed = JSON.parse(element);
                parsedDish.push(parsed);
            });
            restaurant.restaurantName = restaurantName
            restaurant.restaurantPhone = restaurantPhone
            restaurant.restaurantLocation = restaurantLocation
            restaurant.type = type
            if (req.file) {
                const fileName = req.file.filename;
                restaurant.menu = fileName
            }
            restaurant.serviceHour = parsedServiceHour
            restaurant.dish = parsedDish

            restaurant.save();

            res.send({
                restaurantName: restaurant.restaurantName,
                restaurantPhone: restaurant.restaurantPhone,
                restaurantLocation: restaurant.restaurantLocation,
                serviceHour: parsedServiceHour,
                type: restaurant.type,
                dish: parsedDish,
                menu: restaurant.menu
            })
        } catch (error) {
            console.log(error)
            res.status(404).send(error)
        }
    })
    router.post('/carts', controller.createCart)
    router.post('/orderRecord', controller.createOrderRecord)
    router.get('/orderRecord/:userId', controller.findOrderRecords)
    router.get('/restaurants', controller.findRestaurants)
    router.get('/carts/:userId', controller.findCarts)
    router.get('/search', controller.search)
    router.post('/score', controller.createScore)
    //router.put('/updateCart', controller.updateCart)
    app.use('/dashboard', router);
};