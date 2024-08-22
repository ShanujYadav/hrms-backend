import { EmpSalary } from "../models/salarySlip.modal.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addSalary = asyncHandler(async (req, res) => {
    const { employeeId, year, month, baseSalary, hra, otherAllowance } = req.body

    if (!employeeId || !year || !month || !baseSalary || !hra || !otherAllowance) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }
    try {
        const salaryDetail = {
            month,
            baseSalary,
            hra,
            otherAllowance
        }
        const employee = await EmpSalary.findOne({ employeeId })

        if (employee) {
            const yearData = employee.years.get(year.toString()) ||[]
            const existingMonth = yearData.find(salary => salary.month.toLowerCase() === month.toLowerCase())
            if (existingMonth) {
                return res.status(200).json(
                    new ApiResponse(400, `Salary data for ${month} ${year} already exists`)
                )
            }

            yearData.push(salaryDetail)
            employee.years.set(year.toString(), yearData)
            await employee.save()
            return res.status(200).json(
                new ApiResponse('000', 'Salary data added successfully', employee)
            )
        } 
        else {            
            const newEmployee = new EmpSalary({
                employeeId,
                years: {
                    [year]: [salaryDetail]
                }
            })
            await newEmployee.save()
            return res.status(200).json(
                new ApiResponse('000', 'Salary data added successfully', newEmployee)
            )
        }

    } catch (error) {
        res.status(500).json({ message: 'Error updating employee salary', error })
    }
})




const getSalary = asyncHandler(async(req,res) => {
    const { employeeId, year, month } = req.body

    if (!employeeId || !year || !month) {
        return res.status(400).json(
            new ApiResponse(400, "All fields is Required !"))
    }

    try {
        const employee = await EmpSalary.findOne({ employeeId });

        if (!employee) {

            return res.status(404).json(
                new ApiResponse(404, 'Employee not found')
            )
        }
        const yearData = employee.years.get(year.toString()); 
        if (!yearData) {
            return res.status(404).json(
                new ApiResponse(404, `No salary data found for the year ${year}`)
            )
        }
        const monthData = yearData.find(salary => salary.month.toLowerCase() === month.toLowerCase());

        if (!monthData) {
            return res.status(404).json(
                new ApiResponse(404, `No salary data found for ${month} ${year}` )
            )
        }

        return res.status(200).json(
            new ApiResponse('000', `Salary data for ${month} ${year}`, monthData)
        )

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(500,'Error fetching salary data', error)
        )
    }
})


export { addSalary, getSalary }