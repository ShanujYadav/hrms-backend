import  mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const leavSchema=new Schema({
    applicantId:{
        type: Schema.Types.ObjectId,
        ref:'Emp' ,
        required: true,
    },
    applicantName:{
        type: String,
        required: true,
    },
    fromDate: {
        type: String,
        required: true,
    },
    toDate: {
        type: String,
        required: true,
    },
    leaveDays: {
        type: Number,
        required: true,
    },
    sickLeave: {
        type: Number,
        default: 0,
    },
    leaveType: {
        type: String,
        required: true,
    },
    casualLeave: {
        type: Number,
        default: 0,
    },
    totalTakenLeave: {
        type: Number,
        default: 0,
    },
    leaveApproved: {
        type: Boolean,
        default: false,
    },
    applicationStatus: {
        type: String,
        required: true,
    },
},{timestamps:true})


leavSchema.plugin(mongooseAggregatePaginate)
export const Leave=mongoose.model("Leave",leavSchema)