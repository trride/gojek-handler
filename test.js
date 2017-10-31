"use strict";

require("dotenv").config();

const Gojek = require("./index");

const config = {
  authorization: process.env.authorization
};
let start = {
  lat: "-6.115222030783675",
  long: "107.43785351514816"
};
let end = {
  lat: "-7.112052442319981",
  long: "107.44106613099575"
};
let device_token = "";
let gcm_key = "";

const gojek = new Gojek(config);

// async function getPrice(book = false) {
//   let calculatedDetail = await gojek.getCalculateDetail(start, end);
//   const motorBikePriceResult = await gojek.getMotorBikePrice(
//     calculatedDetail.start.origin_lat_long,
//     calculatedDetail.end.destination_lat_long
//   );

//   if (!book) {
//     console.log(motorBikePriceResult);
//     return motorBikePriceResult;
//   }
//   return bookRide(calculatedDetail, motorBikePriceResult);
// }

// async function bookRide(calculatedDetail, motorBikePriceResult) {
//   const bookingData = await gojek.booking(
//     calculatedDetail.start,
//     calculatedDetail.end,
//     motorBikePriceResult.price.estimate_token,
//     device_token,
//     gcm_key
//   );
//   console.log(bookingData);
// }

// getPrice();

// async function getPlace() {
//   let test = await gojek.getPlaceNameFromLatLong(
//     "-7.115222030783675,107.43785351514816"
//   );
//   console.log(test);
// }

// // getPlace();

// async function cancelList() {
//   let cancelList = await gojek.cancelList();
//   console.log(cancelList);
// }

// // cancelList();

// async function cancelBook(orderNo) {
//   let cancelResultDetail = await gojek.cancelBooking(orderNo);
//   console.log(cancelResultDetail);
// }

// // cancelBook('RB-918208577');

// async function getActiveBooking() {
//   let activeBookingDetail = await gojek.getActiveBooking();
//   console.log(activeBookingDetail);
// }

// // getActiveBooking();

// async function getCurrentBookingByOrderNo(orderNo) {
//   let currentBookingDetail = await gojek.getCurrentBookingByOrderNo(orderNo);
//   console.log(currentBookingDetail);
// }

// // getCurrentBookingByOrderNo('RB-918208577');

// async function getAcceptedCurrentBookingByOrderNo(orderNo) {
//   let acceptedCurrentBookingDetail = await gojek.getAcceptedCurrentBookingByOrderNo(
//     orderNo
//   );
//   console.log(acceptedCurrentBookingDetail);
// }

// // getAcceptedCurrentBookingByOrderNo('RB-918208577');

gojek
  //   .stringToPOI("mall", { lat: start.lat, long: start.long })
  .poiToCoord("ChIJ5QMPII3zaS4RzqxjFWPLVK8")
  .then(console.log)
  .catch(console.error);
