const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");

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
    citizenshipId: {
      type: String,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: "text",
      index: true,
    },
    imageFile: {
      imageUrl: {
        type: String,
        trim: true,
      },
      imagePublicId: {
        type: String,
        trim: true,
      },
    },
    frontCitizenshipFile: {
      frontCitizenshipImage: {
        type: String,
        trim: true,
      },
      frontCitizenshipPublicId: {
        type: String,
        trim: true,
      },
    },
    backCitizenshipFile: {
      backCitizenshipImage: {
        type: String,
        trim: true,
      },
      backCitizenshipPublicId: {
        type: String,
        trim: true,
      },
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
      index: true,
      unique: true,
      required: true,
    },
    isVerified: {
      type: String,
      required: true,
      default: "pending",
      index: true,
      enum: ["approved", "pending", "rejected"],
    },
    ownedLand: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Land",
        default: [],
      },
    ],
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

const User = mongoose.model("User", UserSchema);
module.exports = User;
