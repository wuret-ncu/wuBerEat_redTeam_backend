module.exports = mongoose => {
  const UserProfile = mongoose.model(
    "userProfile",
    mongoose.Schema(
      {
        userName: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true
        },
        password: {
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
  return UserProfile;
};