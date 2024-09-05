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
        return res.status(500).json(new ApiResponse(500, "Something went wrong !",))
    }
}

const reqForRegister = asyncHandler(async (req, res) => {
    const { name, phone, role, dateOfBirth, joiningDate, email, address, password, img, education, gender } = req.body
    if ([name, phone, role, dateOfBirth, joiningDate, email, address, password, img, education, gender].some((field) =>
        field?.trim() === '')
    ) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }
    try {
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
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went wrong !"))
    }
})


const reqRegisterList = asyncHandler(async (req, res) => {
    try {
        const allReq = await Emp.find({ 'adminApproved': false }).select("-password -refreshToken")
        if (!allReq) {
            return res.status(204).json(
                new ApiResponse(204, "Not Registred Employee")
            )
        }
        return res.status(200).json(
            new ApiResponse('000', "Pending Request List", allReq)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Something went wrong !")
        )
    }
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
        return res.status(500).json(new ApiResponse(500, "Something went wrong !",)
        )
    }
})


const loginEmp = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email) {
        return res.status(400).json(new ApiResponse(400, "Email are Required"))
    }

    try {
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
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went wrong !",))
    }
})


const empList = asyncHandler(async (req, res) => {
    try {
        const allEmp = await Emp.find({ 'adminApproved': true }).select("-password -refreshToken")
        if (!allEmp) {
            return res.status(204).json(
                new ApiResponse(204, "Not Registred Employee")
            )
        }
        return res.status(200).json(
            new ApiResponse('000', "All Employee List", allEmp)
        )
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went wrong !"))
    }
})


const updateEmpInfo = asyncHandler(async (req, res) => {
    const { id, name, phone, role, dateOfBirth, joiningDate, email, address, img, education, gender } = req.body
    if ([id, name, phone, role, dateOfBirth, joiningDate, email, address, img, education, gender].some((field) =>
        field?.trim() === '')
    ) {
        return res.status(400).json(
            new ApiResponse(400, "All fields are required!")
        )
    }
    try {
        const user = await Emp.findById(id)
        if (!user) {
            return res.status(404).json(
                new ApiResponse(404, "Employee not found!")
            )
        }
        const existedUser = await Emp.findOne({
            $or: [{ phone }, { email }],
            _id: { $ne: id }
        })

        if (existedUser) {
            return res.status(409).json(
                new ApiResponse(409, "Phone or Email is already in use by another Emp!")
            )
        }

        let profileImage = user.img;
        const imgLocalPath = req.files?.img[0]?.path
        if (imgLocalPath) {
            const uploadedImage = await uploadOnCloudinary(imgLocalPath);
            if (!uploadedImage) {
                return res.status(400).json(
                    new ApiResponse(400, "Image upload failed!")
                )
            }
            profileImage = uploadedImage.url;
        }

        const updatedUser = await Emp.findByIdAndUpdate(
            { _id: id },
            {
                name,
                phone,
                role,
                dateOfBirth,
                joiningDate,
                email,
                address,
                education,
                gender,
                img: profileImage
            },
            { new: true, select: '-password -refreshToken' }
        )

        if (!updatedUser) {
            return res.status(404).json(
                new ApiResponse(404, "Employee not found!")
            )
        }
        return res.status(200).json(
            new ApiResponse('000', "Updated Successfully", updatedUser)
        )
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went wrong !",))
    }
})


const deleteEmp = asyncHandler(async (req, res) => {    
    const { id } = req.body
    if (!id) {
        return res.status(404).json(
            new ApiResponse(404, "Id not found!")
        )
    }
    try {
        const deletedUser = await Emp.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json(
                new ApiResponse(404, "User not found!")
            )
        }
        return res.status(200).json(
            new ApiResponse('000', "User deleted successfully", deletedUser)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, "Something went wrong!")
        )
    }
})

// ----------Logout User--------
const logoutEmp = asyncHandler(async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Something went wrong !",))
    }
})
export { loginEmp, logoutEmp, empList, reqForRegister, reqRegisterList, approvedReq, updateEmpInfo, deleteEmp }