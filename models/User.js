import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  email:      { type: String, unique: true, required: true },
  password:   { type: String, required: true },
  avatarImg:  {
    type: String,
    default: "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png"
  },
  name:       { type: String, required: true },
  dob:        { type: Date, required: true },
  country:    { type: String, required: true },
  gender:     { type: String, enum: ["male", "female", "other"], required: true },
  role:       { type: String, enum: ["user", "admin"], default: "user" },
  resetToken:        { type: String },
  resetTokenExpiry:  { type: Date },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);