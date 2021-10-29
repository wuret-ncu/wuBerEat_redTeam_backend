module.exports = mongoose => {
    const UserProfile = mongoose.model(
      "userProfile",
      mongoose.Schema(
        {
          userName: String,
          account: String,
          password: String
        },
        { timestamps: true }
      )
    );
    return UserProfile;
  };