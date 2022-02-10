const { ObjectId } = require("bson");

module.exports = mongoose => {
    const Message = mongoose.model(
        "message",
        mongoose.Schema(
            {
                restaurantId: {
                    type: ObjectId,
                    required: true
                },
                userId: {
                    type: ObjectId,
                    required: true
                },
                content: {
                    type: String,
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
    return Message;
};