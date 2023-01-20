const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
const fuzzy = require("../utils/mongoose-fuzzy-search");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: "text",
      index: true,
    },
    image: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
      default: "Not specified",
    },
    phoneNumber: {
      type: String,
      trim: true,
      required:true
    },

    hashed_password: {
      type: String,
      required: false,
      select: false,
    },
    salt: {
      type: String,
      required: false,
      select: false,
    },
    resetPasswordLink: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.virtual("password")
  .set(async function (password) {
    this.real_password = password;
    this.salt = await this.makeSalt();
    this.hashed_password = this.encryptPasswordFunc(password, this.salt);
  })
  .get(function () {
    return this.real_password;
  });

UserSchema.methods = {
  authentication(password) {
    const encrypt = this.encryptPasswordFunc(password, this.salt);
    if (!encrypt || !this.hashed_password) return false;
    return encrypt === this.hashed_password;
  },

  encryptPasswordFunc(password, salt) {
    if (!password) return "";
    try {
      return crypto.createHmac("sha256", salt).update(password).digest("hex");
    } catch (err) {
      console.log(err);
    }
  },
  makeSalt() {
    const salt = Math.round(new Date().valueOf() * Math.random()) + "";
    return salt;
  },
};

UserSchema.plugin(fuzzy, {
  fields: {
    name_tg: "name",
  },
});
UserSchema.index({ name_tg: 1 });

const User = mongoose.model("User", UserSchema);
module.exports = User;
