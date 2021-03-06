const db = require("../models");
const UserProfile = db.userProfiles;
const Restaurant = db.restaurant;
const Cart = db.cart;
const OrderRecord = db.orderRecord
const bcrypt = require('bcrypt');
const passport = require('passport');
const Score = db.score;
const Message = db.message;


// Create and Save a new User
// exports.create = (req, res) => {
//   console.log(req.body);
//   const { name, email, password, password2 } = req.body;
//   let errors = [];
//   console.log(' Name: ' + name + ' email :' + email + ' pass:' + password);
//   if (!name || !email || !password || !password2) {
//     errors.push({ msg: "Please fill in all fields" })
//   }
//   //check if match
//   if (password !== password2) {
//     errors.push({ msg: "passwords dont match" });
//   }

//   //check if password is more than 6 characters
//   if (password.length < 6) {
//     errors.push({ msg: 'password at least 6 characters' })
//   }

//   if (errors.length > 0) {
//     res.render('register', {
//       errors: errors,
//       name: name,
//       email: email,
//       password: password,
//       password2: password2
//     })
//   } else {
//     UserProfile.findOne({ email: email }).exec((err, user) => {
//       console.log(user);
//       if (user) {
//         errors.push({ msg: 'email already registered' });
//         res.render('register', { errors, name, email, password, password2 })
//       } else {
//         const newUser = new UserProfile({
//           userName: name,
//           email: email,
//           password: password
//         });

//         //hash password
//         bcrypt.genSalt(10, (err, salt) =>
//           bcrypt.hash(newUser.password, salt,
//             (err, hash) => {
//               if (err) throw err;
//               //save pass to hash
//               newUser.password = hash;
//               //save user
//               newUser.save()
//                 .then((value) => {
//                   console.log(value)
//                   req.flash('success_msg', 'You have now registered!');
//                   res.redirect('/users/login');
//                 })
//                 .catch(value => console.log(value));

//             }));
//       }
//     });

//   }
// };

exports.createMenu = async (req, res) => {
  console.log("body: ", req.body);
  console.log(req.file);
  const { userId, restaurantName, restaurantPhone, restaurantLocation,
    serviceHour, type, dish } = req.body;
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

  //var parsedDish = JSON.parse(dish);
  const fileName = req.file.filename;
  console.log(fileName, restaurantName, restaurantPhone, restaurantLocation, type, parsedServiceHour, parsedDish)
  const newRestaurant = new Restaurant({
    userId: userId,
    restaurantName: restaurantName,
    restaurantPhone: restaurantPhone,
    restaurantLocation: restaurantLocation,
    serviceHour: parsedServiceHour,
    type: type,
    menu: fileName,
    dish: parsedDish,
  });
  newRestaurant.save()
    .then((value) => {
      console.log(value)
      res.send({ success: "success" })
    })
    .catch(value => {
      console.log(value)
      res.send({ error: value })
    });
};

exports.createCart = (req, res) => {
  const { userId, history } = req.body;
  console.log(userId);
  let errors = [];
  if (!userId || !history) {
    errors.push({ msg: "Some field missing" })
  }
  if (errors.length > 0) {
    res.send({ errors: errors });
  }
  Cart.find({ userId: userId })
    .then((cartInfo) => {
      if (cartInfo.length == 0) {
        const newCart = new Cart({
          userId: userId,
          history: history,
        });
        newCart.save()
          .then((value) => {
            console.log(value);
            res.cookie('cart', JSON.stringify({ userId: userId, history: history }))
            console.log(req.cookies);
            res.send({ success: "save cart successfully" });
          })
          .catch(value => res.send({ value }));
      }
      else {
        console.log("in");
        cartInfo[0].history = history;
        cartInfo[0].save().then((value) => {
          console.log(value);
          res.cookie('cart', JSON.stringify({ userId: userId, history: history }))
          console.log(req.cookies);
          res.send({ success: "modify cart successfully" });
        })
          .catch(value => res.send({ value }));
      }
      //res.cookie("cart", data);
    })
    .catch((err) => {
      res.status(500).send({
        carts: "err find carts"
      });
    })

  // const newCart = new Cart({
  //   userId: userId,
  //   history: history,
  // });
  // newCart.save()
  //   .then((value) => {
  //     console.log(value);
  //req.flash('success_msg', 'You have now registered!');
  //res.redirect('/users/login');
  // res.cookie("cart", {
  //   restaurantName: restaurantName,
  //   userId: userId,
  //   dish: dish
  // });
  // console.log(req.cookies);
  //   res.send({ success: "save cart successfully" });
  // })
  // .catch(value => console.log(value));
};

exports.createOrderRecord = (req, res) => {
  const { userId, history } = req.body;
  let errors = [];
  if (!userId || !history) {
    errors.push({ msg: "Please fill in all fields" })
  }
  if (errors.length > 0) {
    res.send({ errors: errors });
  }
  const newOrderRecord = new OrderRecord({
    userId: userId,
    history: history,
  });
  newOrderRecord.save()
    .then((value) => {
      console.log(value);
      //req.flash('success_msg', 'You have now registered!');
      //res.redirect('/users/login');
      res.send({ ok: "ok" });
    })
    .catch(value => console.log(value));
};

exports.findRestaurants = (req, res) => {
  Restaurant.find()
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        restaurant: err.restaurant || "Some error occurred while retrieving restaurants.",
      });
    })
};

exports.findCarts = (req, res) => {
  Cart.find({ userId: req.params.userId })
    .then((data) => {
      res.cookie("cart", JSON.stringify(data[0]));
      console.log(req.cookies)
      res.send();
    })
    .catch((err) => {
      res.status(500).send({
        carts: err.cart || "Some error occurred while retrieving carts.",
      });
    })
};

exports.findOrderRecords = (req, res) => {
  OrderRecord.find({ userId: req.params.userId })
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        orderRecords: err.cart || "Some error occurred while retrieving order records.",
      });
    })
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


exports.search = (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Restaurant.find({ restaurantName: regex }, function (err, foundRestaurants) {
      if (err) {
        console.log(err);
      } else {
        res.send(foundRestaurants);
      }
    });
  }
}

exports.createScore = (req, res) => {
  const { restaurantId, userId, score } = req.body;
  console.log(req.body);
  let errors = [];
  if (!restaurantId || !userId || !score) {
    errors.push({ msg: "Please fill in all fields" })
  }
  if (errors.length > 0) {
    res.send({ errors: errors });
  }
  Score.find({ restaurantId: restaurantId })
    .then((scoreInfo) => {
      if (scoreInfo.length == 0) {
        const newScore = new Score({
          restaurantId: restaurantId,
          userId: userId,
          score: score,
        });
        newScore.save()
          .then((value) => {
            console.log(value);
            res.send({ success: "create score successfully" });
          })
          .catch(value => res.send({ value }));
      }
      else {
        console.log("in");
        var exist = false;
        scoreInfo.forEach(eachInfo => {
          if (eachInfo.userId == userId) {
            exist = true
            eachInfo.score = score;
            eachInfo.save().then((value) => {
              console.log(value);
              res.send({ success: "modify score successfully" });
            })
              .catch(value => res.send({ value }));
          }
        });
        console.log("continue!")
        if (exist == false) {
          const newScore = new Score({
            restaurantId: restaurantId,
            userId: userId,
            score: score,
          });
          newScore.save()
            .then((value) => {
              console.log(value);
              res.send({ success: "create score successfully" });
            })
            .catch(value => res.send({ value }));
        }
      }
      //res.cookie("cart", data);
    })
    .catch((err) => {
      res.status(500).send({
        carts: "err find scores"
      });
    })
};

exports.createMessage = (req, res) => {
  const { restaurantId, userId, content } = req.body;
  console.log(req.body);
  let errors = [];
  if (!restaurantId || !userId || !content) {
    errors.push({ msg: "Please fill in all fields" })
  }
  if (errors.length > 0) {
    res.send({ errors: errors });
  }
  Message.find({ restaurantId: restaurantId })
    .then((messageInfo) => {
      if (messageInfo.length == 0) {
        const newMessage = new Message({
          restaurantId: restaurantId,
          userId: userId,
          content: content,
        });
        newMessage.save()
          .then((value) => {
            console.log(value);
            res.send({ success: "create message successfully" });
          })
          .catch(value => res.send({ value }));
      }
      else {
        console.log("in");
        var exist = false;
        messageInfo.forEach(eachInfo => {
          if (eachInfo.userId == userId) {
            exist = true
            eachInfo.content = content;
            eachInfo.save().then((value) => {
              console.log(value);
              res.send({ success: "modify message successfully" });
            })
              .catch(value => res.send({ value }));
          }
        });
        console.log("continue!")
        if (exist == false) {
          const newMessage = new Message({
            restaurantId: restaurantId,
            userId: userId,
            content: content,
          });
          newMessage.save()
            .then((value) => {
              console.log(value);
              res.send({ success: "create message successfully" });
            })
            .catch(value => res.send({ value }));
        }
      }
      //res.cookie("cart", data);
    })
    .catch((err) => {
      res.status(500).send({
        carts: "err find messages"
      });
    })
};

exports.getScore = (req, res) => {
  console.log(req.params.restaurantId)
  Score.find({ restaurantId: req.params.restaurantId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        score: err.score || "Some error occurred while retrieving scores.",
      });
    })
};

exports.getMessage = (req, res) => {
  console.log(req.params.restaurantId)
  Message.find({ restaurantId: req.params.restaurantId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving messages.",
      });
    })
};
// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {

};