"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingRoute = void 0;
var express_1 = __importDefault(require("express"));
var booking_controller_rest_1 = __importDefault(require("../controller/booking.controller.rest"));
var createBookingRoute = function () {
    var router = express_1.default.Router();
    var bookingController = new booking_controller_rest_1.default();
    router.post('/process-booking', bookingController.processBookingOrder.bind(bookingController));
    bookingController.processBookingOrderSub();
    return router;
};
exports.createBookingRoute = createBookingRoute;
//# sourceMappingURL=booking.route.js.map