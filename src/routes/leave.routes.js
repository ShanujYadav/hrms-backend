import { Router } from "express";
import { approvedLeave,leaveStatus, reqForLeave, reqleaveList } from "../controllers/leave.controller.js"
import { verifyUser } from "../middlewares/verifyUser.js";

const leaveRouter = Router()

//Fetch by Emp
leaveRouter.route('/reqForLeave').post(verifyUser, reqForLeave)
leaveRouter.route('/leaveStatus').post(verifyUser,leaveStatus)


//Fetch by Admin
leaveRouter.route('/reqleaveList').post(reqleaveList)
leaveRouter.route('/approvedLeave').post(approvedLeave)


export default leaveRouter