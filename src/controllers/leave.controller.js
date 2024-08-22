import { Leave } from "../models/leave.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const reqForLeave = asyncHandler(async (req, res) => {
    const { applicantName, applicantId, fromDate, toDate, leaveType, leaveDays } = req.body

    if ([applicantName, applicantId, fromDate, toDate, leaveType, leaveDays.toString()].some((field) =>
        field?.trim() === '')
    ) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }

    try {
        const reApplyLeave = await Leave.findOne({
            $or: [{ applicantId }]
        })
        if (reApplyLeave) {
            if (leaveType == "Casual Leave") {
                if (reApplyLeave.casualLeave + Number(leaveDays) > 12) {
                    return res.status(401).json(
                        new ApiResponse(401, "Casual Leave limit exceeded please Apply with Diffrent Leave Type")
                    )
                }
            }
            else if (leaveType == "Sick Leave") {
                if (reApplyLeave.sickLeave + Number(leaveDays) > 12) {
                    return res.status(401).json(
                        new ApiResponse(401, "Sick Leave limit exceeded please Apply with Diffrent Leave Type")
                    )
                }
            }
            const leaveData = await Leave.findOneAndUpdate({ applicantId },
                {
                    'fromDate': fromDate,
                    'toDate': toDate,
                    'leaveType': leaveType,
                    'leaveDays': leaveDays,
                    'applicationStatus':'Pending',
                    'leaveApproved':false,
                })
            if (!leaveData) {
                return res.status(404).json(new ApiResponse(404, "Something Went Wrong !"))
            }
            return res.status(200).json(new ApiResponse('000', "Request Sent Sucessfully", leaveData))
        }
    } catch (error) {
        console.log(error);
    }

    const leave = await Leave.create({
        applicantName,
        applicantId,
        fromDate,
        toDate,
        leaveType,
        leaveDays,
        applicationStatus:'Pending',
    })
    return res.status(200).json(
        new ApiResponse('000', "Request Sent SuccessFully", leave)
    )
})







const approvedLeave = asyncHandler(async (req, res) => {
    const { applicantId, fromDate, toDate, leaveType, leaveDays } = req.body

    if ([applicantId, fromDate, toDate, leaveType, leaveDays.toString()].some((field) =>
        field?.trim() === '')
    ) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }

    let CL
    let SL
    let totalLeave

    try {
        const findData = await Leave.findOne({
            $or: [{ applicantId }]
        })
        if(!findData){
            return res.status(404).json(new ApiResponse(404, "Something Went Wrong !"))
        } 
        totalLeave = findData.totalTakenLeave + Number(leaveDays)
        if (leaveType == 'Casual Leave') {
            CL = findData.casualLeave + Number(leaveDays)
        }
        else if (leaveType == 'Sick leave') {
            SL = findData.sickLeave + Number(leaveDays)
        }
        const approvedLeave = await Leave.findOneAndUpdate({ applicantId },
            {
                'leaveApproved': true,
                'fromDate': fromDate,
                'toDate': toDate,
                'leaveType': leaveType,
                'leaveDays': leaveDays,
                'casualLeave': CL,
                'sickLeave': SL,
                'totalTakenLeave': totalLeave,
                'applicationStatus':'Success',
            })
        if (!approvedLeave) {
            return res.status(404).json(new ApiResponse(404, "Something Went Wrong !"))
        }
        return res.status(200).json(new ApiResponse('000', "Leaave Approved Sucessfully", approvedLeave))
    } catch (e) {
        console.log(e)
    }
})





const leaveStatus = asyncHandler(async (req, res) => {
    const {applicantId}=req.body
    const leaveData = await Leave.findOne({
        $or: [{ applicantId }]
    })    

    if (!leaveData) {
        return res.status(201).json(
        new ApiResponse(201, "Data not Found !",[]))
    }

    return res.status(200).json(
        new ApiResponse('000', "Leave Appliction Status", leaveData)
    )
})



const reqleaveList = asyncHandler(async (req, res) => {
    const allReq = await Leave.find({ 'leaveApproved': false })
    if (!allReq) {
        return res.status(204).json(
            new ApiResponse(204, "Not Pending  Leave")
        )
    }
    return res.status(200).json(
        new ApiResponse('000', "Pending Leave List", allReq)
    )
})




export { reqForLeave, approvedLeave, reqleaveList,leaveStatus }