function ApiResponse(statusCode, message, data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data
}
export {ApiResponse}



// function ApiResponse(first, last, age, eyecolor) {
//     this.firstName = first;
//     this.lastName = last;
//     this.age = age;
//     this.eyeColor = eyecolor;


//     this.fullName = function() {
//       return this.firstName + " " + this.lastName;
//     };
//   }