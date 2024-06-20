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
   reqForRegister)

router.route('/reqRegisterList').post(reqRegisterList)
router.route('/approvedReq').post(approvedReq)
router.route('/empList').post(empList)
router.route('/login').post(loginEmp)



// Secure Routes
router.route('/logout').post(verifyUser, logoutEmp)

export default router
