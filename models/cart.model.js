const { isValidObjectId } = require("mongoose");
const { ObjectId } = require("bson");
const mongoose = require("mongoose");

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
    const Cart = mongoose.model(
        "cart",
        Schema(
            {
                userId: {
                    type: ObjectId,
                    required: true
                },
                history: {
                    type: [History],
                },

            },
            { timestamps: true }
        )
    );
    return Cart;
};