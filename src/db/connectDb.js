import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
   try {
      const connectionInstance = await mongoose.connect(`${process.env.MONGOURI}/${DB_NAME}`)
      //    mongodb+srv://shanujyadav:9528492010@altaneohrms.jy1nw6a.mongodb.net/
      console.log(`MongoDB Connected---- ${connectionInstance.connection.host}`);
   } catch (e) {
      console.log('Mongo DB Error ---', e)
      process.exit(1)
   }
}
export default connectDB