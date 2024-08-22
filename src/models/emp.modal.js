import mongoose, { Schema } from "mongoose"
import Jwt from "jsonwebtoken";
const jwt = Jwt;
import bcrypt from 'bcrypt'


const empSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    dateOfBirth: {
        type: String,
        required: true,
        trim: true,
    },
    joiningDate: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Passowrd is Required"],
        trim: true,
    },
    adminApproved: {
        type: Boolean,
        required: true,
    },  
    education: {
        type: String,
        required: true,
        trim: true,
    },  
    refreshToken: { 
        type: String,
    },  
},
    { timestamps: true })



empSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


empSchema.methods.isPasswordCorrect = async function (password) {
    const dbPass = this.password
    return await bcrypt.compare(password, this.password)
}


empSchema.methods.genrateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        phone: this.phone,
    },
        process.env.ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


empSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Emp = mongoose.model('Emp', empSchema)