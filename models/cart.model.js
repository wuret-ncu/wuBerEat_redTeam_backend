const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("bson");
    
module.exports = mongoose => {
    const Cart = mongoose.model(
      "cart",
      mongoose.Schema(
        {
          userId: {
            type: ObjectId,
            required: true
          },
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
        },
        { timestamps: true }
      )
    );
    return Cart;
  };