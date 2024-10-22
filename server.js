import { app } from './app.js'
import connectDB from './src/db/connectDb.js'
import dotenv from 'dotenv'


dotenv.config({
    path:'../env'
})

app.get('/',(req,res)=>{
    res.send('Ha bhai')
})


connectDB()

.then(()=>{
    app.listen(process.env.PORT|| 8000,()=>{
        console.log(`Server is running at ${process.env.PORT}`);
   })
})

.catch((err)=>{
    console.log('Error=---',err)
})
