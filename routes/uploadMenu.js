const { ensureAuthenticated } = require('../config/auth')
const multer = require('multer')

module.exports = app => {
    const userProfiles = require("../controllers/controller.js");

    var router = require("express").Router();
    const upload = multer(
        {
            limit: {
                // 限制上傳檔案的大小為 1MB
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
    router.post('/avatar', upload.single('avatar'),async (req, res) => {
        console.log(req.file.buffer);
        res.send({ok:"ok"});
    })

    app.use('/dashboard', router);
};