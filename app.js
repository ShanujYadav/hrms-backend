import express  from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { hmacVal } from './src/utils/encrpytion.js'


const app=express()


app.use(cors({
    origin:process.env.CORS_ORIGIN, 
    credentials:true, 
}))

app.use(express.json({limit:"50mb"}))
app.use(express.urlencoded({extended:true,limit:"50kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// ---------Routes Import---------
import empRouter from './src/routes/emp.routes.js'
import leaveRouter from './src/routes/leave.routes.js'
import salaryRouter from './src/routes/salary.routes.js'


//--------- Routes Declaration ---------
app.use('/altaneo/hrms/emp',empRouter)
app.use('/altaneo/hrms/leave',leaveRouter)
app.use('/altaneo/hrms/salary',salaryRouter)


app.get('/',(req,res)=>{
    res.send('Ha bhai')
})

export {app}