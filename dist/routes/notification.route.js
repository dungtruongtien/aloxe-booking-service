"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationRoute = void 0;
var express_1 = __importDefault(require("express"));
var booking_controller_rest_1 = __importDefault(require("../controller/booking/booking.controller.rest"));
var createNotificationRoute = function () {
    var router = express_1.default.Router();
    var bookingController = new booking_controller_rest_1.default();
    router.post('/broadcast', bookingController.processBookingOrder.bind(bookingController));
    bookingController.processBookingOrderSub();
    return router;
};
exports.createNotificationRoute = createNotificationRoute;
//# sourceMappingURL=notification.route.js.map