const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("bson");
    
module.exports = mongoose => {
    const Restaurant = mongoose.model(
      "restaurant",
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
          restaurantPhone: {
            type: String,
            required: true
          },
          restaurantLocation: {
            type: String,
            required: true
          },
          serviceHour: {
            type: Array,
            required: true
          },
          type: {
            type: Array,
            required: true
          },
          avatar: {
            type: Buffer,
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
    return Restaurant;
  };