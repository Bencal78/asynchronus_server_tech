"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Metric {
    constructor(ts, v) {
        this.timestamp = new Date(ts).getTime();
        this.value = v;
    }
}
exports.Metric = Metric;
class MetricsHandler {
    static get(callback) {
        callback(null, [
            new Metric("2018-11-06 16:00 UTC", 12),
            new Metric("2018-11-09 16:30 UTC", 15)
        ]);
    }
}
exports.MetricsHandler = MetricsHandler;
module.exports = {
    get: callback => {
        callback(null, [
            { timestamp: new Date("2018-11-06 16:00 UTC").getTime(), value: 12 },
            { timestamp: new Date("2018-11-09 16:30 UTC").getTime(), value: 15 }
        ]);
    }
};
