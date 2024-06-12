import crypto from "crypto-browserify";
import { ymd } from "./metaData.js";

// import { Buffer } from "buffer";
// window.Buffer = window.Buffer || require("buffer").Buffer;
// const date = new Date();

const pid = process.env.PID
const hmacKey = process.env.HMACKEY



// export const SHA256=(input)=>{
//     const hash = crypto.createHash('sha256').update(input, 'utf-8').digest('hex');
//     return hash.toUpperCase()
//   }



//--------------------------------Hmac--------------------------
const hmacVal = getHmac(pid, ymd)
function getHmac(pid, ymd) {
    const value = pid.toString().concat(ymd)
    var hmac = crypto.createHmac("sha256", hmacKey).update(value).digest("hex")
    return hmac.toString("base64")
}
export { hmacVal }