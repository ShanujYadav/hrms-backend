import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const salaryDetailSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    workingDays: {
        type: Number,
        required: true,
        default: 0
    },
    leaveDays: {
        type: Number,
        required: true,
        default: 0
    },
    absenceDays: {
        type: Number,
        required: true,
        default: 0
    },
    baseSalary: {
        type: Number,
        required: true,
        default: 0
    },
    allowance: {
        type: Number,
        required: true,
        default: 0
    },
    hra: {
        type: Number,
        required: true,
        default: 0
    },
    otherEarnings: {
        type: Number,
        required: true,
        default: 0
    },
    incomeTax: {
        type: Number,
        required: true,
        default: 0
    },
    pf: {
        type: Number,
        required: true,
        default: 0
    },
    otherDeductions: {
        type: Number,
        required: true,
        default: 0
    },
})



const empSalarySchema = new mongoose.Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Emp',
        required: true,
        unique: true
    },
    years: {
        type: Map,
        of: [salaryDetailSchema],
        required: true
    }
}, { timestamps: true })

empSalarySchema.plugin(mongooseAggregatePaginate)
export const EmpSalary = mongoose.model("EmpSalary", empSalarySchema)