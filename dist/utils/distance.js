"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceFromLatLonInKm = void 0;
var getDistanceFromLatLonInKm = function (start, end) {
    var lat1 = start.lat, lon1 = start.long;
    var lat2 = end.lat, lon2 = end.long;
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};
exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
var deg2rad = function (deg) {
    return deg * (Math.PI / 180);
};
//# sourceMappingURL=distance.js.map