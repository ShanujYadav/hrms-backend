import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const salaryDetailSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true
    },
    baseSalary: {
        type: Number,
        required: true
    },
    hra: {
        type: Number,
        required: true
    },
    otherAllowance: {
        type: Number,
        required: true
    }
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