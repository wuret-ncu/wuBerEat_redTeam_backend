const mongoose = require("mongoose")
const { ObjectId } = require("bson");

const Schema = mongoose.Schema

const History = new Schema({
    restaurantName: {
        type: String,
        required: true
    },
    dish: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose => {
    const OrderRecord = mongoose.model(
      "orderRecord",
      mongoose.Schema(
        {
          userId: {
            type: ObjectId,
            required: true
          },
          history:{
            type: [[History]],
          },
        },
        { timestamps: true }
      )
    );
    return OrderRecord;
  };