const { ensureAuthenticated } = require('../config/auth')
const multer = require('multer')
const db = require("../models");
const Restaurant = db.restaurant;
module.exports = app => {
    var router = require("express").Router();

    const upload = multer(
        {
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
    router.post('/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
        console.log("body: ", req.body);
        console.log(req.file);
        const { userId, restaurantName, restaurantPhone, restaurantLocation,
            serviceHour, typeOfRestaurant, dish } = req.body;
        var serviceHourJson = JSON.parse(serviceHour);
        var dishJson = JSON.parse(dish);
        const newRestaurant = new Restaurant({
            userId: req.user._id,
            restaurantName: restaurantName,
            restaurantPhone: restaurantPhone,
            restaurantLocation: restaurantLocation,
            serviceHour: serviceHourJson,
            type: typeOfRestaurant,
            avatar: req.file.buffer,
            dish: dishJson,
        });
        newRestaurant.save()
            .then((value) => {
                console.log(value)
                req.flash('success_msg', 'You have send restaurant information!');
                res.redirect('/dashboard');
            })
            .catch(value => console.log(value));
    })

    router.get('/restaurant/:restaurantId', (req, res) => {
        
    })

    app.use('/dashboard', router);
};