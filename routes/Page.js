const {ensureAuthenticated} = require('../config/auth') 
module.exports = app => {
    //const userProfiles = require("../controllers/controller.js");
  
    var router = require("express").Router();

    //register page
    router.get('/register', (req,res)=>{
      res.render('register');
    })
    
    //dashboard page
    router.get('/dashboard', ensureAuthenticated, (req,res)=>{
      console.log("req.user: ", req.user);
      res.render('dashboard',{
          user: req.user
      });
    })
 
    router.get('/', (req,res)=>{
      res.render('welcome');
    })
    // Retrieve all Tutorials
    //router.get("/", tutorials.findAll);
  
    // Retrieve all published Tutorials
    //router.get("/published", tutorials.findAllPublished);
  
    // Retrieve a single Tutorial with id
    //router.get("/:id", tutorials.findOne);
  
    // Update a Tutorial with id
    //router.put("/:id", tutorials.update);
  
    // Delete a Tutorial with id
    //router.delete("/:id", tutorials.delete);
  
    // Create a new Tutorial
    //router.delete("/", tutorials.deleteAll);
  
    app.use('/', router);
  };