const date = new Date()

const ymd = date.getFullYear().toString()
.concat(String(date.getMonth() + 1).padStart(2, "0"))
.concat(date.getDate().toString().padStart(2, "0"))

export {ymd}