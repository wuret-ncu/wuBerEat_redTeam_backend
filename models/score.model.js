const { ObjectId } = require("bson");

module.exports = mongoose => {
    const Score = mongoose.model(
        "score",
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
                score: {
                    type: Number,
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
    return Score;
};