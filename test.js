"use strict";

require("dotenv").config();

const Gojek = require("./index");

const config = {
  authorization: process.env.authorization
};
let start = {
  lat: "-7.115222030783675",
  long: "107.43785351514816"
};
let end = {
  lat: "-7.112052442319981",
  long: "107.44106613099575"
};
let deviceToken = "";
let gcmKey = "";

const gojek = new Gojek(config);

async function getPriceAndBook (start, end, book = false) {
  let motorBikePriceResult = await gojek.getMotorBikePrice(start, end)

  if (!book) {
    return motorBikePriceResult;
  }

  return bookRide(start, end, motorBikePriceResult);
}

async function bookRide(start, end, motorBikePriceResult) {
  const bookingData = await gojek.booking(
    start,
    end,
    motorBikePriceResult.price.estimateToken,
    deviceToken,
    gcmKey
  );
  console.log(bookingData);
}

// To Just Calculate price
// getPriceAndBook(start, end, false);

// To Directly Book
// getPriceAndBook(start, end, true);

gojek
.stringToPOI("mall", { lat: start.lat, long: start.long })
// .poiToCoord("ChIJ0dovDGD5aS4RFzWaaNKJ4TQ")
.then(console.log)
.catch(console.error)

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


// gojek
//   .getMotorBikePrice(start, end)
//   // .stringToPOI("mall", { lat: start.lat, long: start.long })
//   // .poiToCoord("ChIJ0dovDGD5aS4RFzWaaNKJ4TQ")
//   // .then(console.log)
//   .then(res => {
//       gojek
//       .booking(start, end, res.price.estimateToken)
//       .then(console.log)
//       .catch(console.error)
//   })
//   .catch(console.error);
