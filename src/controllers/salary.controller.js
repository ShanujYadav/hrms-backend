import { Emp } from "../models/emp.modal.js";
import { EmpSalary } from "../models/salarySlip.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addSalary = asyncHandler(async (req, res) => {
    const { employeeId, year, month, workingDays, leaveDays, absenceDays, baseSalary, hra, allowance, otherEarnings, incomeTax, pf, otherDeductions } = req.body
    console.log('req.body---', req.body)

    if (!employeeId || !year || !month || !workingDays || !leaveDays || !absenceDays || !baseSalary || !hra || !allowance || !otherEarnings || !incomeTax || !pf || !otherDeductions) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }
    try {
        const salaryDetail = {
            month,
            workingDays,
            leaveDays,
            absenceDays,
            baseSalary,
            hra,
            allowance,
            otherEarnings,
            incomeTax,
            pf,
            otherDeductions
        }
        const salaryData = await EmpSalary.findOne({ employeeId })

        if (salaryData) {
            const yearData = salaryData.years.get(year.toString()) || []
            const existingMonth = yearData.find(salary => salary.month.toLowerCase() === month.toLowerCase())
            if (existingMonth) {
                return res.status(200).json(
                    new ApiResponse(400, `Salary data for ${month} ${year} already exists`)
                )
            }
            yearData.push(salaryDetail)
            salaryData.years.set(year.toString(), yearData)
            await salaryData.save()

            return res.status(200).json(
                new ApiResponse('000', 'Salary data added successfully', salaryData)
            )
        }
        else {
            const newSalaryData = new EmpSalary({
                employeeId,
                years: {
                    [year]: [salaryDetail]
                }
            })
            await newSalaryData.save()
            return res.status(200).json(
                new ApiResponse('000', 'Salary data added successfully', newSalaryData)
            )
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee salary', error })
    }
})



const getSalary = asyncHandler(async (req, res) => {
    const { employeeId, year, month } = req.body
    if (!employeeId || !year || !month) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }
    try {
        const empSalary = await EmpSalary.findOne({ employeeId });

        if (!empSalary) {
            return res.status(404).json(
                new ApiResponse(404, 'Salary Data Not Exist !')
            )
        }
        const yearData = empSalary.years.get(year.toString());
        if (!yearData) {
            return res.status(404).json(
                new ApiResponse(404, `No salary data found for the year ${year}`)
            )
        }
        const monthData = yearData.find(salary => salary.month.toLowerCase() === month.toLowerCase())


        if (!monthData) {
            return res.status(404).json(
                new ApiResponse(404, `No salary data found for ${month} ${year}`)
            )
        }

        const resp = {
            year,
            monthData
        }

        return res.status(200).json(
            new ApiResponse('000', `Salary data for ${month} ${year}`, resp)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500, 'Error fetching salary data', error)
        )
    }
})


export { addSalary, getSalary }