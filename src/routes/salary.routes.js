import { Router } from "express";
import { addSalary, getSalary,  } from "../controllers/salary.controller.js";


const salaryRouter = Router()

salaryRouter.route('/addSalary').post(addSalary)
salaryRouter.route('/getSalary').post(getSalary)

export default salaryRouter