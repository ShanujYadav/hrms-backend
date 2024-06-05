import { Router } from "express";
import {  approvedReq, empList, loginEmp, logoutEmp, reqForRegister, reqRegisterList } from "../controllers/emp.controller.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import { upload } from "../middlewares/multer.middle.js";
import { validateHeaders } from "../middlewares/validateHeaders.js";

const router = Router()


router.route('/reqForRegister').post(
    upload.fields([
        {
            name: "img",
            maxCount: 1
        },
    ]),
   validateHeaders,reqForRegister)


router.route('/reqRegisterList').post(validateHeaders,reqRegisterList)
router.route('/approvedReq').post(validateHeaders, approvedReq)
router.route('/empList').post(validateHeaders,empList)
router.route('/login').post(validateHeaders,loginEmp)


// Secure Routes
router.route('/logout').post(verifyUser, logoutEmp)

export default router