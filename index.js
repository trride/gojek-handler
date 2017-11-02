"use strict";

const axios = require("axios");

class GojekHandler {
  constructor(config) {
    if (!config) {
      throw new Error("No Gojek Token supplied");
    }

    this.$http = axios.create({
      baseURL: "https://api.gojekapi.com",
      headers: {
        Authorization: config.authorization
      }
    });

    this.getMotorBikePrice = this.getMotorBikePrice.bind(this);
    this.stringToPOI = this.stringToPOI.bind(this);
    this.poiToCoord = this.poiToCoord.bind(this);
  }

  async getCalculateDetail(start, end) {
    if (!start.lat || !start.long || !end.lat || !end.long) {
      throw new Error("no start or end lat/long");
    }
    let origin_lat_long = start.lat.concat(",", start.long);
    let destination_lat_long = end.lat.concat(",", end.long);

    // let origin_address_detail = await this.stringToPOI(
    //   '',
    //   { start.lat, start.long }
    // );
    // let destination_address_detail = await this.stringToPOI(
    //   '',
    //   { destination.lat, destination.long }
    // );

    let detailedAddress = {
      start: {
        origin_lat_long: origin_lat_long,
        origin_name: origin_address_detail.poi.name,
        origin_address: destination_address_detail.poi.address
      },
      end: {
        destination_lat_long: destination_lat_long,
        destination_name: origin_address_detail.poi.name,
        destination_address: destination_address_detail.poi.address
      }
    };

    return detailedAddress;
  }

  getMotorBikePrice(start, end) {
    let origin_lat_long = `${start.lat},${start.long}`;
    let destination_lat_long = `${end.lat},${end.long}`;
    let itinerary = {
      routeRequests: [
        {
          originLatLong: origin_lat_long,
          destinationLatLong: destination_lat_long,
          serviceType: 1
        }
      ],
      serviceType: 1,
      vehicle_type: "bike"
    };

    return this.$http
      .post("/gojek/v2/calculate/gopay", itinerary)
      .then(result => {
        let finalResult = {
          price: {
            fixed: true,
            high: result.data.totalCash,
            low: result.data.totalCash,
            estimateToken: result.data.estimate_token
          }
        };

        return finalResult;
      });
  }

  booking(
    start,
    end,
    estimate_token,
    device_token = "",
    gcm_key = "",
    origin_note = "",
    destination_note = ""
  ) {
    let itinerary = {
      activity_source: 2,
      destination_address: ``,
      destination_lat_long: `${end.lat},${end.long}`,
      destination_name: `destination_test`,
      destination_note: `${destination_note}`,
      device_token: `${device_token}`,
      estimate_token: `${estimate_token}`,
      gcm_key: `${gcm_key}`,
      origin_address: ``,
      origin_lat_long: `${start.lat},${start.long}`,
      origin_name: `origin_test`,
      origin_note: `${origin_note}`,
      payment_type: 0,
      service_type: 1
    };

    return this.$http.post("/go-ride/v4/bookings", itinerary).then(result => {
      return result.data;
    });
  }

  cancelList() {
    return this.$http.get("/gojek/cancelreason/customer/list").then(result => {
      return result.data;
    });
  }

  cancelBooking(
    orderNo,
    cancelDescription = "Cancelled by customer apps",
    cancelReasonId = 56
  ) {
    if (!orderNo) {
      throw new Error("No order found");
    }

    let cancelDetail = {
      activitySource: 2,
      bookingId: 0,
      cancelDescription: `${cancelDescription}`,
      cancelReasonId: cancelReasonId,
      orderNo: `${orderNo}`
    };

    return this.$http
      .put("/gojek/v2/booking/cancelBooking", cancelDetail)
      .then(result => {
        return result.data;
      });
  }

  getActiveBooking() {
    return this.$http.get("/v1/customers/active_bookings").then(result => {
      return result.data;
    });
  }

  getCurrentBookingByOrderNo(orderNo) {
    return this.$http
      .get(`/gojek/v2/booking/findByOrderNo/${orderNo}`)
      .then(result => {
        return result.data;
      });
  }

  getAcceptedCurrentBookingByOrderNo(orderNo) {
    return this.$http
      .get(`/gojek/v2/booking/${orderNo}/driver`)
      .then(result => {
        return result.data;
      })
      .catch(err => err.response.data);
  }

  async stringToPOI(str, from = { lat: -6, long: 106 }) {
    const { data: { data } } = await this.$http({
      method: "get",
      url: "/poi/v3/findPoi",
      params: {
        location: `${from.lat}%2C${from.long}`,
        name: str,
        service_type: 1
      }
    });
    return {
      poi: data
    };
  }

  async poiToCoord(id) {
    const { data: { data } } = await this.$http({
      method: "get",
      url: "/poi/v3/findLatLng",
      params: {
        placeid: id,
        service_type: 1
      }
    });
    return data;
  }
}

module.exports = GojekHandler;
