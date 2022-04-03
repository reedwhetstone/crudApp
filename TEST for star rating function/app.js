/** @format */

let review = 5;

// function repeatStringNumTimes(str, num) {
//   console.log(str);
// }
// repeatStringNumTimes(
//   `<i class="bi-star-fill" style="font-size: 1rem; color: #FD4;"></i>`,
//   review
// );

// function repeatStringNumTimes(string, times) {
//   //Step 1. If times is positive, return the repeated string
//   if (times > 0) {
//     // (3 > 0) => true
//     console.log(string.repeat(times)); // return "abc".repeat(3); => return "abcabcabc";
//   }

//   //Step 2. Else if times is negative, return an empty string if true
//   else {
//     return "";
//   }
// }

// repeatStringNumTimes(`a`, review);

function repeatStringNumTimes(string, times) {
  console.log(string.repeat(times));
}

repeatStringNumTimes(`a`, review);
