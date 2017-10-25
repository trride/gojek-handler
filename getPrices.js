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

    getMotorBikePrice (start, end) {
        if (!start.lat || !start.long || !end.lat || !end.long) {
            throw new Error('no start or end lat/long');
        }

        let itinerary = {
            routeRequests: [
                {
                    originLatLong: `${ start.lat },${ start.long }`,
                    destinationLatLong: `${ end.lat },${ end.long }`,
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
                    low: result.data.totalCash
                }
            };

            return finalResult;
        })
    }
}

module.exports = {
    GojekHandler
}
