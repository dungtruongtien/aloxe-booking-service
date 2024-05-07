"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRootRoute = void 0;
var express_1 = __importDefault(require("express"));
var booking_route_1 = require("./booking.route");
var notification_route_1 = require("./notification.route");
var createRootRoute = function () {
    var router = express_1.default.Router();
    var bookingRoute = (0, booking_route_1.createBookingRoute)();
    var notificationRoute = (0, notification_route_1.createNotificationRoute)();
    router.use('/booking', bookingRoute);
    router.use('/notification', notificationRoute);
    return router;
};
exports.createRootRoute = createRootRoute;
//# sourceMappingURL=api.route.js.map