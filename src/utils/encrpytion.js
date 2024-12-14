import crypto from "crypto-browserify";
import { ymd } from "./metaData.js";


const pid = process.env.PID
const hmacKey = process.env.HMACKEY





//--------------------------------Hmac--------------------------
// const hmacVal = getHmac(pid, ymd)

const hmacVal=1

// function getHmac(pid, ymd) {
//     const value = pid.toString().concat(ymd)
//     var hmac = crypto.createHmac("sha256", hmacKey).update(value).digest("hex")
//     return hmac.toString("base64")
// }


export { hmacVal }