import { Emp } from "../models/emp.modal.js"
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from "../utils/Cloudinary.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"




const genrateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await Emp.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while genrating Access And Refresh Token")
    }
}

const reqForRegister = asyncHandler(async (req, res) => {
    const { name, phone, role, dateOfBirth, joiningDate, email, address, password, img ,education,gender} = req.body

    // check for Empty Values
    if ([name, phone, role, dateOfBirth, joiningDate, email, address, password, img,education,gender].some((field) =>
        field?.trim() === '')
    ) {
        // throw new ApiError(400, "All fields is Required !")
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }
    // check for Exist User
    const existedUser = await Emp.findOne({
        $or: [{ phone }, { email }]
    })

    if (existedUser) {
        return res.status(409).json(
            new ApiResponse(409, "User is Already Exists !"))
    }
    
    // Check For img
    const imgLocalPath = req.files?.img[0]?.path
    if (!imgLocalPath) {
        return res.status(400).json(
            new ApiResponse(400, "ProfileImage  is Required !"))
    }

    // Upload file on Cloudinary
    const profileImage = await uploadOnCloudinary(imgLocalPath)
    if (!profileImage) {
        return res.status(400).json(
            new ApiResponse(400, "Image  is Required !"))
    }

    //Create Entry in DB

    const user = await Emp.create({
        name,
        phone,
        role,
        dateOfBirth,
        joiningDate,
        email,
        address,
        password,
        education,
        gender,
        img: profileImage.url,
        adminApproved: false
    })

    const createdUser = await Emp.findById(user._id).select(
        '-password -refreshToken'
    )

    // Check if User Created
    if (!createdUser) {
        throw new ApiError(500, "Something Went Wrong While creating User")
    }
    return res.status(200).json(
        new ApiResponse('000', "Register Request Sent Successfully", createdUser)
    )
})


const reqRegisterList = asyncHandler(async (req, res) => {
    const allReq = await Emp.find({ 'adminApproved': false }).select("-password -refreshToken")
    if (!allReq) {
        return res.status(204).json(
            new ApiResponse(204, "Not Registred Employee")
        )
    }
    return res.status(200).json(
        new ApiResponse('000', "Pending Request List", allReq)
    )
})



const approvedReq = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        throw new ApiError(404, "Id is Required")
    }
    try {
        const approvedEmp = await Emp.findByIdAndUpdate({ _id: id }, { 'adminApproved': true }).select('-password')
        if (!approvedEmp) {
            return res.status(404).json(new ApiResponse(404, "User Does not Exist or Invalied Id"))
        }
        return res.status(200).json(new ApiResponse('000', "User Approved Sucessfully", approvedEmp))
    } catch (error) {
        return res.status(404).json(new ApiResponse(404, "User Does not Exist or Invalied Id",)
        )
    }
})


const loginEmp = asyncHandler(async (req, res) => {
    const { email, password } = req.body    
    if (!email) {
        return res.status(400).json(new ApiResponse(400, "Email are Required"))
    }

    const user = await Emp.findOne({
        $and: [{ email }, { adminApproved: true }]
    })
    if (!user) {
        return res.status(404).json(new ApiResponse(404, "User Does not Exist or Not Approved by Admin"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        return res.status(401).json(new ApiResponse(401, "Incorrect Password"))
    }

    const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id)
    
    // find user and remove password and refreshToken from them
    const loggedInUser = await Emp.findById(user._id).select("-password -refreshToken")

    // Cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            '000', "User loggedIn SuccessFully", {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        ))
})



const empList = asyncHandler(async (req, res) => {
    const allEmp = await Emp.find({ 'adminApproved': true }).select("-password -refreshToken")
    if (!allEmp) {
        return res.status(204).json(
            new ApiResponse(204, "Not Registred Employee")
        )
    }
    return res.status(200).json(
        new ApiResponse('000', "All Employee List", allEmp)
    )
})


// Logout User
const logoutEmp = asyncHandler(async (req, res) => {
    await Emp.findByIdAndUpdate(
        req.user._id, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse('000', "User Logged Out", {}))
})


export { loginEmp, logoutEmp, empList, reqForRegister, reqRegisterList, approvedReq }