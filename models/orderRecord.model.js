const mongoose = require("mongoose")
const { ObjectId } = require("bson");
    
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
            type: Array,
            required: true
          },
          date: {
            type: Date,
            default: Date.now
          }
        },
        { timestamps: true }
      )
    );
    return OrderRecord;
  };