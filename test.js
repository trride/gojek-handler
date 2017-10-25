'use strict';

require('dotenv').config()

const Gojek = require('./getPrices');

const config = {
    authorization: process.env.authorization
}

let start = {
    lat: '-6.2268253',
    long: '106.8070988'
}

let end = {
    lat: '-6.202178',
    long: '106.784386'
}

const gojek = new Gojek.GojekHandler(config);

gojek.getMotorBikePrice(start, end)
.then(console.log);
