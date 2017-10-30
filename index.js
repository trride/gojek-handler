'use strict'

const axios = require('axios');

class GojekHandler {
    constructor(config) {
        if (!config) {
            throw new Error('No Gojek Token supplied');
        }

        this.$http = axios.create({
            baseURL: 'https://api.gojekapi.com',
            headers: {
                'Authorization': config.authorization
            }
        })

        this.getMotorBikePrice = this.getMotorBikePrice.bind(this);
    };

    getPlaceNameFromLatLong(lat_long) {
        return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${ lat_long }&key=AIzaSyBNrNDZwtw7EAkLxmYvzrHE7hFbvkIeSeQ`)
        .then(result => {
            let address = {
                short_name: result.data.results[0].address_components[1].short_name || "Unnamed",
                formatted_address: result.data.results[0].formatted_address || "Unnamed"
            }

            return address;
        })
    }

    async getCalculateDetail (start, end) {
        if (!start.lat || !start.long || !end.lat || !end.long) {
            throw new Error('no start or end lat/long');
        }

        let origin_lat_long = start.lat.concat(',', start.long);
        let destination_lat_long = end.lat.concat(',', end.long);
        let origin_address_detail = await this.getPlaceNameFromLatLong(origin_lat_long);
        let destination_address_detail = await this.getPlaceNameFromLatLong(destination_lat_long);

        let detailedAddress = {
            start: {
                origin_lat_long: origin_lat_long,
                origin_name: origin_address_detail.short_name,
                origin_address: destination_address_detail.formatted_address,
            },
            end: {
                destination_lat_long: destination_lat_long,
                destination_name: origin_address_detail.short_name,
                destination_address: destination_address_detail.formatted_address
            }
        }

        return detailedAddress;
    }

    getMotorBikePrice (start, end) {
        let itinerary = {
            routeRequests: [
                {
                    originLatLong: `${ start }`,
                    destinationLatLong: `${ end }`,
                    serviceType: 1
                }
            ],
            serviceType: 1,
            vehicle_type: 'bike'
        };

        return this.$http.post('/gojek/v2/calculate/gopay', itinerary)
        .then(result => {
            let finalResult = {
                price: {
                    fixed: true,
                    high: result.data.totalCash,
                    low: result.data.totalCash,
                    estimate_token: result.data.estimate_token
                }
            };

            return finalResult;
        });
    }

    booking (start, end, estimate_token, device_token = '', gcm_key = '', origin_note = '', destination_note = '') {
        let itinerary = {
            activity_source: 2,
            destination_address: `${ end.destination_address }`,
            destination_lat_long: `${ end.destination_lat_long }`,
            destination_name: `${ end.destination_name }`,
            destination_note: `${ destination_note }`,
            device_token: `${ device_token }`,
            estimate_token: `${ estimate_token }`,
            gcm_key: `${ gcm_key }`,
            origin_address: `${ start.origin_address }`,
            origin_lat_long: `${ start.origin_lat_long }`,
            origin_name: `${ start.origin_name }`,
            origin_note: `${ origin_note }`,
            payment_type: 0,
            service_type: 1
        }

        return this.$http.post('/go-ride/v4/bookings', itinerary)
        .then(result => {
            return result.data
        });
    }

    cancelList () {
        return this.$http.get('/gojek/cancelreason/customer/list')
        .then(result => {
            return result.data
        });
    }

    cancelBooking (orderNo ,cancelDescription = "Cancelled by customer apps", cancelReasonId = 56) {
        if (!orderNo) {
            throw new Error('No order found');
        }

        let cancelDetail = {
            activitySource: 2,
            bookingId: 0,
            cancelDescription: `${ cancelDescription }`,
            cancelReasonId: cancelReasonId,
            orderNo: `${ orderNo }`
        }

        return this.$http.put('/gojek/v2/booking/cancelBooking', cancelDetail)
        .then(result => {
            return result.data
        });
    }

    // getDriverEstimatedTimeOfArrival (start) {
    //     return axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=-6.225963,106.8106523&destination=-6.225776,106.809794&key=AIzaSyBNrNDZwtw7EAkLxmYvzrHE7hFbvkIeSeQ')
    //     .then(result => {
    //         return result.data.routes[0].legs[0].duration
    //     });
    // }

    getActiveBooking () {
        return this.$http.get('/v1/customers/active_bookings')
        .then(result => {
            return result.data
        });
    }

    getCurrentBookingByOrderNo (orderNo) {
        return this.$http.get(`/gojek/v2/booking/findByOrderNo/${ orderNo }`)
        .then(result => {
            return result.data;
        });
    }

    getAcceptedCurrentBookingByOrderNo (orderNo) {
        return this.$http.get(`/gojek/v2/booking/${ orderNo }/driver`)
        .then(result => {
            return result.data;
        })
        .catch(err => err.response.data);
    }
}

module.exports = {
    GojekHandler
}
