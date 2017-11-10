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

async function getPriceAndBook(start, end, book = false) {
  let motorBikePriceResult = await gojek.getMotorBikePrice(start, end);

  if (!book) {
    return motorBikePriceResult;
  }

  return bookRide(start, end, motorBikePriceResult);
}

async function bookRide(start, end, motorBikePriceResult) {
  const bookingData = await gojek.booking(
    motorBikePriceResult.price.estimateToken,
    start,
    end,
    deviceToken,
    gcmKey
  );
  console.log(bookingData);
}

// To Just Calculate price
// getPriceAndBook(start, end, false);

// To Directly Book
// getPriceAndBook(start, end, true);

// gojek
//   // .getMotorBikePrice(start, end)
//   // .requestRide(
//   //   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XG4gIFwiY3VzdG9tZXJfaWRcIjogXCI1NDM1Njg2MjBcIixcbiAgXCJzZXJ2aWNlX3R5cGVcIjogMSxcbiAgXCJzdXJnZV9mYWN0b3JcIjogMS4wLFxuICBcImxhdFwiOiAtNy4xMTUyMjIwMzA3ODM2NzUsXG4gIFwibG5nXCI6IDEwNy40Mzc4NTM1MTUxNDgxNlxufSIsImV4cCI6MTUwOTY0NDgxNn0.2h1zzVForwnuOoWZ6GwS2IMwr6foAZVdRRIZwmn79ZFJ3Kn9_ypwRVgME3IJNbM6HtLiB-3dcx4hNANz8Hr0ng",
//   //   start,
//   //   end
//   // )
//   .cancelRide("RB-928304503")
//   // .stringToPOI("mall", { lat: start.lat, long: start.long })
//   // .poiToCoord("ChIJ0dovDGD5aS4RFzWaaNKJ4TQ")
//   .then(console.log)
//   .catch(console.error);

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

async function getCurrentBookingByOrderNo(orderNo) {
  let currentBookingDetail = await gojek.rideStatus(orderNo);
  console.log(currentBookingDetail);
}

//-- Canceled
// getCurrentBookingByOrderNo('RB-929194418');
//-- Completed
// getCurrentBookingByOrderNo('RB-928148964');
//-- Not Found
// getCurrentBookingByOrderNo('RB-936769375');

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

gojek
  .reverseGeocode({
    longitude: 106.78162,
    latitude: -6.260719
  })
  .then(data => {
    console.log(data);
  })
  .catch(console.error);
